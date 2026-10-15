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

// Registered after load so it never competes with the first render. A failure
// here is not worth surfacing — the site works fine without it.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
