import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import TextEditor from "../components/TextEditor"
import ShareModal from "../components/ShareModal"
import OnlineUsers from "../components/OnlineUsers"
import VersionHistory from "../components/VersionHistory"
import SaveIndicator from "../components/SaveIndicator"
import "./Editor.css"

function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [onlineUsers, setOnlineUsers] = useState([])
  const [quillInstance, setQuillInstance] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState("saved")
  const [lastSavedTime, setLastSavedTime] = useState(null)

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsTitleEditing(false)
    if (!documentTitle.trim()) {
      setDocumentTitle("Untitled Document")
    }
  }

  return (
    <div className="editor-page">
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")} title="Back to dashboard">
            ←
          </button>
          
          {isTitleEditing ? (
            <input
              type="text"
              value={documentTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
              className="title-input"
              autoFocus
            />
          ) : (
            <h2
              className="editor-heading"
              onClick={() => setIsTitleEditing(true)}
              title="Click to edit title"
            >
              {documentTitle}
            </h2>
          )}
        </div>

        <div className="editor-topbar-center">
          <OnlineUsers users={onlineUsers} />
        </div>

        <div className="editor-topbar-right">
          <SaveIndicator status={saveStatus} lastSaved={lastSavedTime} />

          <button
            className="editor-version-btn"
            onClick={() => document.querySelector(".version-dropdown-toggle")?.click()}
            title="View version history"
          >
            ⏱ History
          </button>

          <button
            className="editor-share-btn"
            onClick={() => setShowShare(true)}
          >
            <span className="share-icon">👥</span>
            Share
          </button>
        </div>
      </header>

      <main className="editor-main">
        <TextEditor
          documentId={id}
          setOnlineUsers={setOnlineUsers}
          setQuillInstance={setQuillInstance}
          setSaveStatus={setSaveStatus}
          setLastSavedTime={setLastSavedTime}
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
