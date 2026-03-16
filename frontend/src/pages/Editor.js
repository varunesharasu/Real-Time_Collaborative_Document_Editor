import React, { useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"

import TextEditor from "../components/TextEditor"
import ShareModal from "../components/ShareModal"
import OnlineUsers from "../components/OnlineUsers"
import VersionHistory from "../components/VersionHistory"
import SaveIndicator from "../components/SaveIndicator"
import DocumentStats from "../components/DocumentStats"
import FindReplace from "../components/FindReplace"
import { showToast } from "../utils/Toast"
import DocumentService from "../utils/DocumentService"
import "./Editor.css"

function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [onlineUsers, setOnlineUsers] = useState([])
  const [quillInstance, setQuillInstance] = useState(null)
  const [showShare, setShowShare] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showFindReplace, setShowFindReplace] = useState(false)
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [saveStatus, setSaveStatus] = useState("saved")
  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [documentContent, setDocumentContent] = useState("")

  const handleTitleChange = (e) => {
    setDocumentTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsTitleEditing(false)
    if (!documentTitle.trim()) {
      setDocumentTitle("Untitled Document")
    }
  }

  // Export document in various formats
  const handleExportDocument = useCallback((format) => {
    if (!quillInstance) {
      showToast("Document not ready", "error")
      return
    }

    const content = quillInstance.root.innerHTML
    DocumentService.exportDocument(documentTitle, content, format)
    showToast(`Document exported as ${format.toUpperCase()}`, "success")
  }, [quillInstance, documentTitle])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "f") {
        e.preventDefault()
        setShowFindReplace(!showFindReplace)
      } else if (e.key === ",") {
        e.preventDefault()
        setShowStats(!showStats)
      } else if (e.shiftKey && e.key === "E") {
        e.preventDefault()
        handleExportDocument("txt")
      }
    }
  }, [showFindReplace, showStats, handleExportDocument])

  // Print document
  const handlePrintDocument = useCallback(() => {
    if (!quillInstance) {
      showToast("Document not ready", "error")
      return
    }

    const printContent = quillInstance.root.innerHTML
    const printWindow = window.open("", "", "width=800,height=600")
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1, h2, h3 { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${documentTitle}</h1>
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }, [quillInstance, documentTitle])

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

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
            className="editor-utility-btn"
            onClick={() => setShowFindReplace(!showFindReplace)}
            title="Find & Replace (Ctrl+F)"
          >
            🔍 Find
          </button>

          <button
            className="editor-utility-btn"
            onClick={() => setShowStats(!showStats)}
            title="Document Stats (Ctrl+,)"
          >
            📊 Stats
          </button>

          <div className="editor-dropdown">
            <button className="editor-utility-btn" title="More options">
              ⋮
            </button>
            <div className="editor-dropdown-menu">
              <button onClick={() => handleExportDocument("txt")} className="dropdown-item">
                📄 Export as Text
              </button>
              <button onClick={() => handleExportDocument("html")} className="dropdown-item">
                🌐 Export as HTML
              </button>
              <button onClick={() => handleExportDocument("md")} className="dropdown-item">
                📝 Export as Markdown
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handlePrintDocument} className="dropdown-item">
                🖨 Print
              </button>
            </div>
          </div>

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
          setDocumentContent={setDocumentContent}
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

        <DocumentStats
          content={documentContent}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />

        <FindReplace
          isOpen={showFindReplace}
          onClose={() => setShowFindReplace(false)}
          quill={quillInstance}
        />
      </main>
    </div>
  )
}

export default Editor
