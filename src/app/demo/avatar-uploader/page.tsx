'use client'

import React, { useState } from 'react'
import AvatarUploader from '@/components/ui/avatar-uploader'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function AvatarUploaderDemoPage() {
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Demo: AvatarUploader</h1>
      <AvatarUploader
        outputSize={256}
        outputFormat="png"
        quality={0.92}
        onExport={({ dataUrl }) => setResultUrl(dataUrl)}
      />
      <div className="space-y-2">
        <div className="text-sm">Resultado</div>
        <Avatar className="size-16">
          {resultUrl ? (
            <AvatarImage src={resultUrl} alt="Avatar result" />
          ) : (
            <AvatarFallback>AV</AvatarFallback>
          )}
        </Avatar>
      </div>
    </div>
  )
}