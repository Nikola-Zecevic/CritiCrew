<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./router/App.jsx";
>>>>>>> 02a6fb1c0da4da51c18637bbc8bfab992add5ee1

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
