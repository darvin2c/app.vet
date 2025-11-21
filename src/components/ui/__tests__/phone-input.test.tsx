import React from 'react'
// @vitest-environment happy-dom
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import PhoneInput from '@/components/ui/phone-input'

describe('PhoneInput', () => {
  it('estructura básica: muestra select con prefijo y textbox', () => {
    render(<PhoneInput defaultCountry="PE" />)
    const selectTrigger = screen.getByLabelText('country-select')
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    expect(selectTrigger).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(screen.getByText('+51')).toBeInTheDocument()
  })

  it('emite E.164 con prefijo al escribir número nacional', () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: '987654321' } })
    expect(onChange).toHaveBeenCalled()
    const [value, isValid] = onChange.mock.calls.at(-1)!
    expect(value).toBe('+51987654321')
    expect(typeof isValid).toBe('boolean')
  })

  it('divide value E.164 en prefijo y número nacional para mostrar', () => {
    render(<PhoneInput value="+51987654321" defaultCountry="PE" />)
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    expect(input.value).toBe('987654321')
  })

  it('detecta país desde E.164 y emite E.164 al cambiar el input', async () => {
    const onChange = vi.fn()
    render(
      <PhoneInput
        value="+51987654321"
        defaultCountry="PE"
        onChange={onChange}
      />
    )
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    expect(input.value).toBe('987654321')
    // Cambiar el número para forzar onChange
    fireEvent.change(input, { target: { value: '9876543210' } })
    await Promise.resolve()
    await waitFor(() => expect(onChange).toHaveBeenCalled())
    const [value1] = onChange.mock.calls.at(-1)!
    expect(value1).toBe('+519876543210')
  })

  it('solo acepta dígitos en el input y emite E.164', () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="CO" onChange={onChange} />)
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'abc-987 654' } })
    expect(input.value).toBe('987654')
    const [value] = onChange.mock.calls.at(-1)!
    expect(value).toBe('+57987654')
  })

  it('no emite onChange al montar sin interacción', () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('cambiar país con input vacío emite solo prefijo', async () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    const selectTrigger = screen.getByLabelText('country-select')
    fireEvent.click(selectTrigger)
    const option = screen.getByText('Colombia')
    fireEvent.click(option)
    await waitFor(() => expect(onChange).toHaveBeenCalled())
    const [value] = onChange.mock.calls.at(-1)!
    expect(value).toBe('+57')
  })

  it('cambiar país con dígitos conserva número y actualiza prefijo', async () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: '123' } })
    const [first] = onChange.mock.calls.at(-1)!
    expect(first).toBe('+51123')

    const selectTrigger = screen.getByLabelText('country-select')
    fireEvent.click(selectTrigger)
    const option = screen.getByText('Colombia')
    fireEvent.click(option)
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2))
    const [second] = onChange.mock.calls.at(-1)!
    expect(second).toBe('+57123')
  })

  it('actualizar props value (E.164) sincroniza select e input sin emitir', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <PhoneInput value="+519876543" defaultCountry="PE" onChange={onChange} />
    )
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    expect(input.value).toBe('9876543')
    expect(screen.getByText('+51')).toBeInTheDocument()

    rerender(
      <PhoneInput value="+579876543" defaultCountry="PE" onChange={onChange} />
    )
    expect(input.value).toBe('9876543')
    expect(screen.getByText('+57')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('secuencia rápida alternando país e input mantiene E.164 correcto', async () => {
    const onChange = vi.fn()
    render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
    const input = screen.getByLabelText('phone-input') as HTMLInputElement
    const trigger = screen.getByLabelText('country-select')

    fireEvent.change(input, { target: { value: '45' } })
    let [v1] = onChange.mock.calls.at(-1)!
    expect(v1).toBe('+5145')

    fireEvent.click(trigger)
    fireEvent.click(screen.getByText('Colombia'))
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(2))
    let [v2] = onChange.mock.calls.at(-1)!
    expect(v2).toBe('+5745')

    fireEvent.change(input, { target: { value: '456' } })
    let [v3] = onChange.mock.calls.at(-1)!
    expect(v3).toBe('+57456')

    fireEvent.click(trigger)
    fireEvent.click(screen.getByText('Perú'))
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(4))
    let [v4] = onChange.mock.calls.at(-1)!
    expect(v4).toBe('+51456')
  })

  describe('Entrada de datos: todas las formas', () => {
    it('controlado: 1 dígito no inserta prefijo en input tras re-render', () => {
      function Wrapper() {
        const [val, setVal] = React.useState('')
        return (
          <PhoneInput
            defaultCountry="PE"
            value={val}
            onChange={(v) => setVal(v)}
          />
        )
      }
      render(<Wrapper />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement
      fireEvent.change(input, { target: { value: '9' } })
      expect(input.value).toBe('9')
      expect(input.value).not.toContain('+')
      expect(input.value).not.toMatch(/^51/)
    })

    it('controlado: value parcial +515 no aparece con prefijo en input', () => {
      const { rerender } = render(<PhoneInput defaultCountry="PE" value="" />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement
      expect(input.value).toBe('')
      rerender(<PhoneInput defaultCountry="PE" value="+515" />)
      expect(input.value).toBe('5')
      expect(input.value).not.toContain('+')
      expect(input.value).not.toMatch(/^51/)
    })

    it('paste con prefijo: "+51 9" queda sólo "9" en input', () => {
      render(<PhoneInput defaultCountry="PE" />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement
      fireEvent.paste(input, {
        clipboardData: { getData: () => '+51 9' },
      } as any)
      fireEvent.change(input, { target: { value: '+51 9' } })
      expect(input.value).toBe('9')
      expect(input.value).not.toContain('+')
      expect(input.value).not.toMatch(/^51/)
    })
    it('typing: un dígito NO inserta prefijo en input y emite E.164', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement
      expect(screen.getByText('+51')).toBeInTheDocument()

      fireEvent.change(input, { target: { value: '9' } })
      const [v] = onChange.mock.calls.at(-1)!
      expect(input.value).toBe('9')
      expect(input.value).toMatch(/^\d+$/)
      expect(input.value).not.toContain('+')
      expect(input.value).not.toMatch(/^\s*\+?51/)
      expect(v).toBe('+519')
    })

    it('typing: dos dígitos NO inserta prefijo en input y emite E.164', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement
      expect(screen.getByText('+51')).toBeInTheDocument()

      fireEvent.change(input, { target: { value: '98' } })
      const [v] = onChange.mock.calls.at(-1)!
      expect(input.value).toBe('98')
      expect(input.value).toMatch(/^\d+$/)
      expect(input.value).not.toContain('+')
      expect(input.value).not.toMatch(/^\s*\+?51/)
      expect(v).toBe('+5198')
    })
    it('typing incremental (cambios sucesivos en input)', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement

      fireEvent.change(input, { target: { value: '9' } })
      let [v1] = onChange.mock.calls.at(-1)!
      expect(v1).toBe('+519')

      fireEvent.change(input, { target: { value: '98' } })
      let [v2] = onChange.mock.calls.at(-1)!
      expect(v2).toBe('+5198')

      fireEvent.change(input, { target: { value: '987' } })
      let [v3] = onChange.mock.calls.at(-1)!
      expect(v3).toBe('+51987')
    })

    it('backspace: reduce dígitos y emite E.164 actualizado', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement

      fireEvent.change(input, { target: { value: '123' } })
      let [v1] = onChange.mock.calls.at(-1)!
      expect(v1).toBe('+51123')

      // Simular backspace cambiando el valor a 12
      fireEvent.change(input, { target: { value: '12' } })
      let [v2] = onChange.mock.calls.at(-1)!
      expect(v2).toBe('+5112')
    })

    it('paste: pegar texto con símbolos y emitir E.164 con solo dígitos', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement

      fireEvent.paste(input, {
        clipboardData: {
          getData: () => 'abc 000-111',
        },
      } as any)
      // El control se actualiza en onChange, simulamos el valor pegado
      fireEvent.change(input, { target: { value: 'abc 000-111' } })
      let [v] = onChange.mock.calls.at(-1)!
      expect(input.value).toBe('000111')
      expect(v).toBe('+51000111')
    })

    it('composition IME: entrada compuesta no introduce prefijo en input', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement

      fireEvent.compositionStart(input)
      fireEvent.change(input, { target: { value: 'こ123' } })
      fireEvent.compositionEnd(input)

      let [v] = onChange.mock.calls.at(-1)!
      expect(input.value).toBe('123')
      expect(v).toBe('+51123')
    })

    it('autofill/input programático: input emite correctamente E.164', () => {
      const onChange = vi.fn()
      render(<PhoneInput defaultCountry="PE" onChange={onChange} />)
      const input = screen.getByLabelText('phone-input') as HTMLInputElement

      // Simular autofill estableciendo el valor y disparando input
      fireEvent.input(input, { target: { value: '888777' } })
      let [v] = onChange.mock.calls.at(-1)!
      expect(input.value).toBe('888777')
      expect(v).toBe('+51888777')
    })
  })
})