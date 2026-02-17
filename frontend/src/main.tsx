import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './context/app.provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'react-bootstrap'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>
)
