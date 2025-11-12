'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { cn } from '@/lib/utils'

type OutputFormat = 'jpeg' | 'png'

type Stage = 'idle' | 'editing' | 'exported'

export type AvatarUploaderProps = {
  className?: string
  style?: React.CSSProperties
  outputSize?: number
  outputFormat?: OutputFormat
  quality?: number
  theme?: 'light' | 'dark'
  onDropAccepted?: (file: File) => void
  onDropRejected?: (error: string) => void
  onEditStart?: () => void
  onEditChange?: (state: {
    crop?: Crop
    rotation: number
    brightness: number
    contrast: number
  }) => void
  onEditComplete?: (crop: PixelCrop) => void
  onExport?: (payload: { blob: Blob; dataUrl: string }) => void
}

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export function validateAvatarFile(file: File) {
  if (!ACCEPTED_MIME.includes(file.type)) {
    return 'Formato inválido. Solo JPG, PNG o WebP.'
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'El archivo supera 5MB.'
  }
}

function getCanvasMime(format: OutputFormat) {
  return format === 'jpeg' ? 'image/jpeg' : 'image/png'
}

function drawImageToCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  crop: PixelCrop,
  rotation: number,
  brightness: number,
  contrast: number,
  targetSize: number
) {
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio || 1
  canvas.width = Math.floor(targetSize * pixelRatio)
  canvas.height = Math.floor(targetSize * pixelRatio)
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  ctx.imageSmoothingQuality = 'high'
  ctx.filter = `brightness(${brightness}) contrast(${contrast})`
  const sx = crop.x * scaleX
  const sy = crop.y * scaleY
  const sWidth = crop.width * scaleX
  const sHeight = crop.height * scaleY
  ctx.save()
  ctx.translate(canvas.width / pixelRatio / 2, canvas.height / pixelRatio / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(
    image,
    sx,
    sy,
    sWidth,
    sHeight,
    -targetSize / 2,
    -targetSize / 2,
    targetSize,
    targetSize
  )
  ctx.restore()
}

function exportCanvas(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
) {
  return new Promise<{ blob: Blob; dataUrl: string }>((resolve) => {
    const mime = getCanvasMime(format)
    canvas.toBlob(
      (blob) => {
        const b = blob as Blob
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({ blob: b, dataUrl: String(reader.result) })
        }
        reader.readAsDataURL(b)
      },
      mime,
      quality
    )
  })
}

export const AvatarUploader = React.memo(function AvatarUploader({
  className,
  style,
  outputSize = 256,
  outputFormat = 'png',
  quality = 0.92,
  theme,
  onDropAccepted,
  onDropRejected,
  onEditStart,
  onEditChange,
  onEditComplete,
  onExport,
}: AvatarUploaderProps) {
  const [stage, setStage] = useState<Stage>('idle')
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  })
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [rotation, setRotation] = useState(0)
  const [brightness, setBrightness] = useState(1)
  const [contrast, setContrast] = useState(1)

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections && fileRejections.length > 0) {
        setError('Archivo inválido.')
        onDropRejected && onDropRejected('Archivo inválido.')
        return
      }
      const file = acceptedFiles[0]
      if (!file) return
      const v = validateAvatarFile(file)
      if (v) {
        setError(v)
        onDropRejected && onDropRejected(v)
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(String(reader.result))
        setStage('editing')
        setError(null)
        onDropAccepted && onDropAccepted(file)
        onEditStart && onEditStart()
      }
      reader.readAsDataURL(file)
    },
    [onDropAccepted, onDropRejected]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    multiple: false,
    maxSize: MAX_SIZE_BYTES,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    onDrop,
  })

  const filterPreview = useMemo(
    () => `brightness(${brightness}) contrast(${contrast})`,
    [brightness, contrast]
  )

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      imgRef.current = e.currentTarget
    },
    []
  )

  useEffect(() => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return
    drawImageToCanvas(
      previewCanvasRef.current,
      imgRef.current,
      completedCrop,
      rotation,
      brightness,
      contrast,
      outputSize
    )
  }, [completedCrop, rotation, brightness, contrast, outputSize])

  useEffect(() => {
    onEditChange && onEditChange({ crop, rotation, brightness, contrast })
  }, [crop, rotation, brightness, contrast, onEditChange])

  const handleExport = useCallback(async () => {
    if (!previewCanvasRef.current) return
    const payload = await exportCanvas(
      previewCanvasRef.current,
      outputFormat,
      quality
    )
    setStage('exported')
    onEditComplete && completedCrop && onEditComplete(completedCrop)
    onExport && onExport(payload)
  }, [completedCrop, onEditComplete, onExport, outputFormat, quality])

  const clearAll = useCallback(() => {
    setStage('idle')
    setError(null)
    setImageUrl(null)
    setRotation(0)
    setBrightness(1)
    setContrast(1)
    setCrop({ unit: '%', x: 10, y: 10, width: 80, height: 80 })
    setCompletedCrop(null)
  }, [])

  return (
    <div
      className={cn(
        'w-full max-w-full',
        theme === 'dark' ? 'text-white' : 'text-foreground',
        className
      )}
      style={style}
    >
      {stage === 'idle' && (
        <div
          {...getRootProps({
            className: cn(
              'border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 transition-colors',
              isDragActive ? 'border-primary' : 'border-muted-foreground/30',
              isDragAccept ? 'bg-muted/50' : '',
              isDragReject ? 'border-destructive' : 'hover:border-primary'
            ),
            role: 'button',
            tabIndex: 0,
            'aria-label': 'Subir imagen de avatar',
            'aria-busy': isDragActive ? 'true' : 'false',
          })}
        >
          <input {...getInputProps()} aria-invalid={error ? 'true' : 'false'} />
          <span className="text-sm">
            Arrastra y suelta o haz clic para seleccionar
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP. Máx 5MB.
          </span>
        </div>
      )}

      {stage === 'editing' && imageUrl && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="w-full">
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              keepSelection
              ruleOfThirds
            >
              <img
                src={imageUrl}
                alt="Imagen a recortar"
                onLoad={onImageLoad}
                style={{
                  filter: filterPreview,
                }}
              />
            </ReactCrop>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={cn('px-3 py-1 rounded-md border')}
                onClick={clearAll}
              >
                Quitar
              </button>
              <button
                type="button"
                className={cn(
                  'px-3 py-1 rounded-md bg-primary text-primary-foreground'
                )}
                onClick={handleExport}
                aria-label="Exportar avatar"
              >
                Exportar
              </button>
            </div>
          </div>

          <div className="w-full">
            <div className="grid gap-3">
              <label className="flex items-center gap-3">
                <span className="w-24 text-sm">Rotación</span>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  aria-label="Rotación"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-24 text-sm">Brillo</span>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.01}
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  aria-label="Brillo"
                />
              </label>
              <label className="flex items-center gap-3">
                <span className="w-24 text-sm">Contraste</span>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.01}
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  aria-label="Contraste"
                />
              </label>
            </div>

            <div className="mt-4">
              <div className="text-sm mb-2">Vista previa</div>
              <canvas
                ref={previewCanvasRef}
                className="border rounded-md w-full max-w-xs"
                aria-label="Vista previa del recorte"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-destructive text-sm" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  )
})

export default AvatarUploader
