import { exportToCSS } from '../exporter'

describe('exportToCSS', () => {
  it('formats a style map into valid CSS', () => {
    const styles = {
      'div.hero > h1': {
        'padding-top': '24px',
        color: '#334155',
      },
    }
    const result = exportToCSS(styles, 'example.com')
    expect(result).toContain('/* NovaStyle Overrides — example.com */')
    expect(result).toContain('div.hero > h1 {')
    expect(result).toContain('padding-top: 24px !important;')
    expect(result).toContain('color: #334155 !important;')
    expect(result).toContain('}')
  })

  it('includes ISO timestamp when generated', () => {
    const styles = { '.test': { color: 'red' } }
    const result = exportToCSS(styles)
    expect(result).toMatch(/Generated: \d{4}-\d{2}-\d{2}/)
  })

  it('skips empty selector entries', () => {
    const styles = {
      '.filled': { color: 'blue' },
      '.empty': {},
    }
    const result = exportToCSS(styles)
    expect(result).toContain('.filled')
    expect(result).not.toContain('.empty')
  })

  it('handles empty style map', () => {
    const result = exportToCSS({})
    expect(result).toContain('/* NovaStyle Overrides')
    expect(result).not.toContain('{')
  })
})
