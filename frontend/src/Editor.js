import React from "react"
import { useParams } from "react-router-dom"
import TextEditor from "./TextEditor"

function Editor() {

  const { id } = useParams()

  return (
    <div>
      <TextEditor documentId={id} />
    </div>
  )
}

export default Editor