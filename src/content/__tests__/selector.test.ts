import { computeSelector, extractStyles } from '../selector'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('computeSelector', () => {
  it('includes tag + id when element has an id', () => {
    document.body.innerHTML = '<div id="hero"><h1>Title</h1></div>'
    const el = document.getElementById('hero')!
    expect(computeSelector(el)).toBe('div#hero')
  })

  it('uses tag + all non-hash classes', () => {
    document.body.innerHTML = '<div class="unique-class"><span>Text</span></div><div class="other"></div>'
    const el = document.querySelector('.unique-class')!
    expect(computeSelector(el)).toBe('div.unique-class')
  })

  it('falls back to nth-child path for non-unique elements', () => {
    document.body.innerHTML = '<ul><li>A</li><li>B</li></ul>'
    const el = document.querySelectorAll('li')[1]!
    const selector = computeSelector(el)
    expect(selector).toContain('li:nth-child(2)')
  })

  it('skips hashed class names from CSS modules', () => {
    document.body.innerHTML = '<div class="css-19v6lw9 other-class"><p>Text</p></div>'
    const el = document.querySelector('p')!
    expect(computeSelector(el)).toBe('div > p')
  })

  it('prefers data-testid over bare tag', () => {
    document.body.innerHTML = '<button data-testid="submit-btn">Submit</button>'
    const el = document.querySelector('[data-testid="submit-btn"]')!
    expect(computeSelector(el)).toBe('button[data-testid="submit-btn"]')
  })

  it('prefers data-cy over bare tag', () => {
    document.body.innerHTML = '<input data-cy="email-input" />'
    const el = document.querySelector('[data-cy="email-input"]')!
    expect(computeSelector(el)).toBe('input[data-cy="email-input"]')
  })

  it('uses data-testid for disambiguation when tag alone is ambiguous', () => {
    document.body.innerHTML = '<button data-testid="a">A</button><button data-testid="b">B</button>'
    const el = document.querySelector('[data-testid="a"]')!
    expect(computeSelector(el)).toBe('button[data-testid="a"]')
  })

  it('includes all classes when tag + classes selector is unique', () => {
    document.body.innerHTML = '<div class="foo bar baz"><p>A</p></div><div class="other"><p>B</p></div>'
    const el = document.querySelector('.foo')!
    expect(computeSelector(el)).toBe('div.foo.bar.baz')
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
    expect(selector).toBe('h1#title')
    expect(result[selector]).toBeDefined()
    expect(result[selector]['color']).toMatch(/red|rgb/)
    expect(result[selector]['font-size']).toBe('24px')
  })
})
