import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AvatarUploader, { validateAvatarFile } from '../avatar-uploader'

function createFile(name: string, type: string, size = 1024) {
  const blob = new Blob(['x'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('validateAvatarFile', () => {
  it('rejects invalid type', () => {
    const file = createFile('a.txt', 'text/plain')
    expect(validateAvatarFile(file)).toBeTruthy()
  })
  it('rejects file > 5MB', () => {
    const file = createFile('a.png', 'image/png', 6 * 1024 * 1024)
    expect(validateAvatarFile(file)).toBe('El archivo supera 5MB.')
  })
  it('accepts png within size', () => {
    const file = createFile('a.png', 'image/png', 1000)
    expect(validateAvatarFile(file)).toBeUndefined()
  })
})

describe('AvatarUploader', () => {
  it('renders drop area', () => {
    render(<AvatarUploader />)
    expect(screen.getByLabelText('Subir imagen de avatar')).toBeInTheDocument()
  })

  it('handles accepted drop and enters editing', async () => {
    const onAccepted = vi.fn()
    render(<AvatarUploader onDropAccepted={onAccepted} />)
    const file = createFile('a.png', 'image/png')
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    Object.defineProperty(fileInput, 'files', { value: [file] })
    fireEvent.change(fileInput)
    await waitFor(() => expect(onAccepted).toHaveBeenCalled())
    expect(screen.getByText('Vista previa')).toBeInTheDocument()
  })
})
