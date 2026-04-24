import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from "./redux/redux-store/store";
import './index.css'
import App from './App.tsx'
import './styles/globals.css'
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(

 <StrictMode>
    <Provider store={store}>
      <App />
  </Provider>
  </StrictMode>,
)
