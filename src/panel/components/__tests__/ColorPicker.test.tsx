import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker } from '../ColorPicker'

describe('ColorPicker', () => {
  it('renders text color and background sections', () => {
    render(<ColorPicker selector=".test" styles={{}} onUpdate={vi.fn()} />)
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Text Color')).toBeInTheDocument()
    expect(screen.getByText('Background')).toBeInTheDocument()
  })

  it('calls onUpdate with color value for text input', () => {
    const onUpdate = vi.fn()
    render(<ColorPicker selector=".test" styles={{}} onUpdate={onUpdate} />)
    const textInputs = screen.getAllByRole('textbox')
    fireEvent.change(textInputs[0], { target: { value: '#ff0000' } })
    expect(onUpdate).toHaveBeenCalledWith('.test', 'color', '#ff0000')
  })

  it('calls onUpdate with background-color for background text input', () => {
    const onUpdate = vi.fn()
    render(<ColorPicker selector=".test" styles={{}} onUpdate={onUpdate} />)
    const textInputs = screen.getAllByRole('textbox')
    fireEvent.change(textInputs[1], { target: { value: '#00ff00' } })
    expect(onUpdate).toHaveBeenCalledWith('.test', 'background-color', '#00ff00')
  })
})
