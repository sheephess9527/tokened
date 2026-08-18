import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Routes are prerendered to static HTML at build time; hydrate that markup
// rather than throwing it away and re-rendering from scratch.
if (container.firstElementChild) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
