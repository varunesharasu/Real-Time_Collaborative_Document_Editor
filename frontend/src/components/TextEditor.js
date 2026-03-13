import React, { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import "./TextEditor.css"

const SAVE_INTERVAL_MS = 2000

const socket = io("http://localhost:5000")

function TextEditor({ documentId, setOnlineUsers }) {

  const [quill, setQuill] = useState()

  useEffect(() => {

    if (socket == null || quill == null) return

    socket.once("load-document", document => {

      quill.setContents(document)

      quill.enable()

    })

    socket.emit("get-document", documentId)

  }, [socket, quill, documentId])

  useEffect(() => {

    if (socket == null || quill == null) return

    const handler = delta => {

      quill.updateContents(delta)

    }

    socket.on("receive-changes", handler)

    return () => {

      socket.off("receive-changes", handler)

    }

  }, [socket, quill])

  useEffect(() => {

    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {

      if (source !== "user") return

      socket.emit("send-changes", delta)

    }

    quill.on("text-change", handler)

    return () => {

      quill.off("text-change", handler)

    }

  }, [socket, quill])

  useEffect(() => {

    if (socket == null || quill == null) return

    const interval = setInterval(() => {

      socket.emit("save-document", quill.getContents())

    }, SAVE_INTERVAL_MS)

    return () => clearInterval(interval)

  }, [socket, quill])

  useEffect(() => {

    const user =
      JSON.parse(localStorage.getItem("user"))

    socket.emit("join-document", {
      documentId,
      user
    })

    socket.on("online-users", users => {

      setOnlineUsers(users)

    })

  }, [documentId])

  const wrapperRef = useCallback(wrapper => {

    if (wrapper == null) return

    wrapper.innerHTML = ""

    const editor = document.createElement("div")

    wrapper.append(editor)

    const q = new Quill(editor, {
      theme: "snow"
    })

    q.disable()

    q.setText("Loading...")

    setQuill(q)

  }, [])

  return (

    <div
      className="text-editor-container"
      ref={wrapperRef}
      style={{ height:"90vh" }}
    />

  )

}

export default TextEditor