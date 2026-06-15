import { render, screen, fireEvent } from '@testing-library/react'
import { BoxModel } from '../BoxModel'

describe('BoxModel', () => {
  it('renders margin, border, padding sections', () => {
    render(<BoxModel selector=".test" onUpdate={vi.fn()} />)
    expect(screen.getByText('Box Model')).toBeInTheDocument()
    expect(screen.getByText('margin')).toBeInTheDocument()
    expect(screen.getByText('border')).toBeInTheDocument()
    expect(screen.getByText('padding')).toBeInTheDocument()
  })

  it('renders 12 number inputs (3 layers × 4 sides)', () => {
    render(<BoxModel selector=".test" onUpdate={vi.fn()} />)
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs).toHaveLength(12)
  })

  it('calls onUpdate with px suffix when value changes', () => {
    const onUpdate = vi.fn()
    render(<BoxModel selector=".test" onUpdate={onUpdate} />)
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '10' } })
    expect(onUpdate).toHaveBeenCalledWith('.test', 'margin-top', '10px')
  })
})
