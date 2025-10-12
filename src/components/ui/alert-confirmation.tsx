'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface AlertConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string | React.ReactNode
  confirmText: string
  isLoading?: boolean
}

export function AlertConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  isLoading = false,
}: AlertConfirmationProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [isConfirming, setIsConfirming] = React.useState(false)

  const isConfirmDisabled =
    inputValue !== confirmText || isLoading || isConfirming

  const handleConfirm = async () => {
    if (isConfirmDisabled) return

    try {
      setIsConfirming(true)
      await onConfirm()
      setInputValue('')
      onClose()
    } catch (error) {
      console.error('Error during confirmation:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleClose = () => {
    if (isConfirming) return
    setInputValue('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConfirmDisabled) {
      handleConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">{title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation-input">
              Para confirmar, escribe{' '}
              <span className="font-semibold text-destructive">
                {confirmText}
              </span>
            </Label>
            <Input
              id="confirmation-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escribe "${confirmText}" para confirmar`}
              disabled={isConfirming}
              className="font-mono"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isConfirming}
            className="mt-2 sm:mt-0"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full sm:w-auto"
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConfirming ? 'Confirmando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
