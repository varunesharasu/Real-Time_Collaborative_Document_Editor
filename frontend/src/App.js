import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Editor from "./pages/Editor"

import "./styles.css"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login Page */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Register Page */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard Page */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Document Editor */}
        <Route
          path="/documents/:id"
          element={<Editor />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App