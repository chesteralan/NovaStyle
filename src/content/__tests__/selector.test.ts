import { computeSelector, extractStyles } from '../selector'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('computeSelector', () => {
  it('uses id when element has one', () => {
    document.body.innerHTML = '<div id="hero"><h1>Title</h1></div>'
    const el = document.getElementById('hero')!
    expect(computeSelector(el)).toBe('#hero')
  })

  it('uses unique class name', () => {
    document.body.innerHTML = '<div class="unique-class"><span>Text</span></div><div class="other"></div>'
    const el = document.querySelector('.unique-class')!
    expect(computeSelector(el)).toBe('.unique-class')
  })

  it('falls back to nth-child path for non-unique elements', () => {
    document.body.innerHTML = '<ul><li>A</li><li>B</li></ul>'
    const el = document.querySelectorAll('li')[1]!
    const selector = computeSelector(el)
    expect(selector).toContain('li:nth-child(2)')
  })

  it('skips hashed class names from CSS modules', () => {
    document.body.innerHTML = '<div class="css-19v6lw9 other-class"><p>Text</p></div>'
    const parent = document.querySelector('div')!
    const el = parent.querySelector('p')!
    expect(computeSelector(el)).toBe('div > p')
  })

  it('uses data-testid attribute', () => {
    document.body.innerHTML = '<button data-testid="submit-btn">Submit</button>'
    const el = document.querySelector('[data-testid="submit-btn"]')!
    expect(computeSelector(el)).toBe('[data-testid="submit-btn"]')
  })

  it('uses data-cy attribute', () => {
    document.body.innerHTML = '<input data-cy="email-input" />'
    const el = document.querySelector('[data-cy="email-input"]')!
    expect(computeSelector(el)).toBe('[data-cy="email-input"]')
  })
})

describe('extractStyles', () => {
  it('returns style map with computed selector key', () => {
    document.body.innerHTML = '<h1 id="title" style="color: red; font-size: 24px;">Hello</h1>'
    const el = document.getElementById('title')!
    el.style.setProperty('color', 'red')
    el.style.setProperty('font-size', '24px')
    const result = extractStyles(el)
    const selector = Object.keys(result)[0]
    expect(selector).toBe('#title')
    expect(result[selector]).toBeDefined()
    expect(result[selector]['color']).toMatch(/red|rgb/)
    expect(result[selector]['font-size']).toBe('24px')
  })
})
