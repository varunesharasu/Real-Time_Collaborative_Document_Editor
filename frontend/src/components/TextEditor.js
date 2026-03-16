import React, { useCallback, useEffect, useState } from "react"
import Quill from "quill"
import QuillCursors from "quill-cursors"
import "quill/dist/quill.snow.css"
import { io } from "socket.io-client"
import "./TextEditor.css"

Quill.register("modules/cursors", QuillCursors)

const SAVE_INTERVAL_MS = 2000

const socket = io("https://real-time-collaborative-document-editor-9lkv.onrender.com")

function TextEditor({ documentId, setOnlineUsers, setQuillInstance }) {

  const [quill, setQuill] = useState()

  useEffect(() => {

    if (socket == null || quill == null) return

    socket.once("load-document", document => {

      quill.setContents(document)
      quill.enable()

    })

    socket.emit("get-document", documentId)

  }, [quill, documentId])



  useEffect(() => {

    if (socket == null || quill == null) return

    const handler = delta => {

      quill.updateContents(delta)

    }

    socket.on("receive-changes", handler)

    return () => socket.off("receive-changes", handler)

  }, [quill])



  useEffect(() => {

    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {

      if (source !== "user") return

      socket.emit("send-changes", delta)

    }

    quill.on("text-change", handler)

    return () => quill.off("text-change", handler)

  }, [quill])



  useEffect(() => {

    if (socket == null || quill == null) return

    const interval = setInterval(() => {

      socket.emit(
        "save-document",
        quill.getContents()
      )

    }, SAVE_INTERVAL_MS)

    return () => clearInterval(interval)

  }, [quill])



  // JOIN DOCUMENT
  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"))

    socket.emit("join-document", {
      documentId,
      user
    })

    socket.on("online-users", users => {

      setOnlineUsers(users)

    })

  }, [documentId])



  // SEND CURSOR POSITION
  useEffect(() => {

    if (!quill) return

    quill.on("selection-change", range => {

      const user = JSON.parse(localStorage.getItem("user"))

      socket.emit("cursor-change", {
        documentId,
        user,
        range
      })

    })

  }, [quill])



  // RECEIVE CURSOR POSITION
  useEffect(() => {

    if (!quill) return

    const cursors = quill.getModule("cursors")

    socket.on("receive-cursor", data => {

      const { user, range, socketId } = data

      if (!range) return

      cursors.createCursor(
        socketId,
        user.username,
        "blue"
      )

      cursors.moveCursor(socketId, range)

    })

  }, [quill])



  const wrapperRef = useCallback(wrapper => {

    if (wrapper == null) return

    wrapper.innerHTML = ""

    const editor = document.createElement("div")

    wrapper.append(editor)

    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"]
        ]
      }
    })

    q.disable()
    q.setText("Loading...")

    setQuill(q)
    setQuillInstance(q)

  }, [])

  return (
    <div
      className="text-editor-container"
      ref={wrapperRef}
      style={{ height: "80vh" }}
    />
  )

}

export default TextEditor