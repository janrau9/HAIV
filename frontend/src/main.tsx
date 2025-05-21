import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ModalProvider } from './contexts/ModalContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
)
