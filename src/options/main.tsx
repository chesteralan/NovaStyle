import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Options } from './Options'
import './Options.css'

const root = document.getElementById('novastyle-options')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Options />
    </StrictMode>,
  )
}
