import React, { useState } from "react"
import { useParams } from "react-router-dom"

import TextEditor from "../components/TextEditor"
import ShareModal from "../components/ShareModal"
import OnlineUsers from "../components/OnlineUsers"
import VersionHistory from "../components/VersionHistory"
import "./Editor.css"

function Editor() {

  const { id } = useParams()

  const [onlineUsers, setOnlineUsers] = useState([])
  const [quillInstance, setQuillInstance] = useState(null)
  const [showShare, setShowShare] = useState(false)

  return (

    <div className="editor-page">

      <header className="editor-topbar">
        <h2 className="editor-heading">Live Collaborative Editor</h2>

        <button
          className="editor-share-trigger"
          onClick={() => setShowShare(true)}
        >
          Share
        </button>
      </header>

      <OnlineUsers users={onlineUsers} />

      <main className="editor-main">
        <TextEditor
          documentId={id}
          setOnlineUsers={setOnlineUsers}
          setQuillInstance={setQuillInstance}
        />

        <VersionHistory
          documentId={id}
          quill={quillInstance}
        />

        {showShare && (
          <ShareModal
            documentId={id}
            onClose={() => setShowShare(false)}
          />
        )}
      </main>

    </div>

  )

}

export default Editor