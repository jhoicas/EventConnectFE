import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('No se encontró el elemento #root');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('Error during initial render:', error);
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : '';
  document.body.innerHTML = `
    <div style="padding: 24px; font-family: sans-serif;">
      <h1 style="color: #b91c1c; margin-bottom: 12px;">Error al iniciar la aplicación</h1>
      <p style="margin-bottom: 12px;">${message}</p>
      <pre style="white-space: pre-wrap; background: #f5f5f5; padding: 12px; border-radius: 6px;">${stack ?? ''}</pre>
    </div>
  `;
}
