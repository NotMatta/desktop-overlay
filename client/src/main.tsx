import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/providers/theme-provider'
import './index.css'
import App from './App.tsx'
import PathProvider from './components/providers/path-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PathProvider>
          <App />
        </PathProvider>
      </ThemeProvider>
    </StrictMode>,
)
