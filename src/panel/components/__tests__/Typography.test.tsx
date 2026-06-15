import { render, screen, fireEvent } from '@testing-library/react'
import { Typography } from '../Typography'

describe('Typography', () => {
  it('renders typography section', () => {
    render(<Typography selector=".test" onUpdate={vi.fn()} />)
    expect(screen.getByText('Typography')).toBeInTheDocument()
    expect(screen.getByText('Font Family')).toBeInTheDocument()
    expect(screen.getByText('Size (px)')).toBeInTheDocument()
    expect(screen.getByText('Line Height')).toBeInTheDocument()
    expect(screen.getByText('Letter Spacing (px)')).toBeInTheDocument()
    expect(screen.getByText('Weight')).toBeInTheDocument()
    expect(screen.getByText('Alignment')).toBeInTheDocument()
  })

  it('calls onUpdate with font-family on select change', () => {
    const onUpdate = vi.fn()
    render(<Typography selector=".test" onUpdate={onUpdate} />)
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'serif' } })
    expect(onUpdate).toHaveBeenCalledWith('.test', 'font-family', 'serif')
  })

  it('calls onUpdate with font-size on number input change', () => {
    const onUpdate = vi.fn()
    render(<Typography selector=".test" onUpdate={onUpdate} />)
    const spinbuttons = screen.getAllByRole('spinbutton')
    fireEvent.change(spinbuttons[0], { target: { value: '24' } })
    expect(onUpdate).toHaveBeenCalledWith('.test', 'font-size', '24px')
  })

  it('calls onUpdate with text-align on alignment button click', () => {
    const onUpdate = vi.fn()
    render(<Typography selector=".test" onUpdate={onUpdate} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(onUpdate).toHaveBeenCalledWith('.test', 'text-align', 'left')
    fireEvent.click(buttons[1])
    expect(onUpdate).toHaveBeenCalledWith('.test', 'text-align', 'center')
  })

  it('renders all four alignment buttons', () => {
    render(<Typography selector=".test" onUpdate={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
    expect(buttons[0]).toHaveTextContent('L')
    expect(buttons[1]).toHaveTextContent('C')
    expect(buttons[2]).toHaveTextContent('R')
    expect(buttons[3]).toHaveTextContent('J')
  })
})
