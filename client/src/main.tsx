import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { theme } from 'antd'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
      <App />
    </ConfigProvider>
)
