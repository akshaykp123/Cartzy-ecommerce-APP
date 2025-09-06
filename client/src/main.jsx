import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from 'sonner';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster 
        richColors 
        toastOptions={{
          classNames: {
            success: "bg-green-500 text-white border border-green-600 shadow-lg",
            error: "bg-red-500 text-white border border-red-600 shadow-lg",
            warning: "bg-yellow-400 text-black border border-yellow-600 shadow-lg",
            info: "bg-blue-500 text-white border border-blue-600 shadow-lg",
          },
        }}
      />
    </Provider>
  </BrowserRouter>
)
