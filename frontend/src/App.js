import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Editor from "./pages/Editor"
import ToastContainer from "./components/ToastContainer"

/**
 * App - Main application router and layout
 * Provides navigation between authentication, dashboard, and editor pages
 */
function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      
      <Routes>
        {/* Authentication Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Document Editor */}
        <Route path="/documents/:id" element={<Editor />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
