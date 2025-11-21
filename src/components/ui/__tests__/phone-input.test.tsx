import React from 'react'
// @vitest-environment jsdom
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import PhoneInput from '@/components/ui/phone-input'

describe('PhoneInput', () => {
  it('emite E.164 con prefijo al escribir número nacional', () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '987654321' } })
    expect(onChange).toHaveBeenCalled()
    const [value, isValid] = onChange.mock.calls.at(-1)!
    expect(value).toBe('+51987654321')
    expect(typeof isValid).toBe('boolean')
  })

  it('divide value E.164 en prefijo y número nacional para mostrar', () => {
    render(<PhoneInput value="+51987654321" defaultCountry="PE" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('987654321')
  })

  it('detecta país desde E.164 y emite E.164 al cambiar el input', () => {
    const onChange = vi.fn()
    render(<PhoneInput value="+51987654321" defaultCountry="PE" onChange={onChange} />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('987654321')
    // Simular cambio de país: escribir de nuevo para forzar onChange con país actual
    fireEvent.change(input, { target: { value: '987654321' } })
    const [value1] = onChange.mock.calls.at(-1)!
    expect(value1).toBe('+51987654321')
  })
})