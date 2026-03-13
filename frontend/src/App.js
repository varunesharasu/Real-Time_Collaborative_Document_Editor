import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"
import Editor from "./Editor"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToDocument />} />
        <Route path="/documents/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  )
}

function RedirectToDocument() {
  const id = uuidV4()
  window.location.href = `/documents/${id}`
  return null
}

export default App