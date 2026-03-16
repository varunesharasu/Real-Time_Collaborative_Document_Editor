import React, { useEffect, useState } from "react"
import axios from "axios"
import ConfirmDialog from "./ConfirmDialog"
import { showToast } from "../utils/Toast"
import "./VersionHistory.css"

/**
 * VersionHistory - Manage document version snapshots
 * Displays timeline of saved versions with restore functionality
 */
function VersionHistory({ documentId, quill }) {
  const [versions, setVersions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [restoreDialog, setRestoreDialog] = useState({
    isOpen: false,
    version: null
  })

  // Fetch versions on mount and document change
  useEffect(() => {
    const fetchVersions = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(
          `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/versions/${documentId}`
        )
        setVersions(res.data || [])
      } catch (err) {
        console.error(err)
        showToast("Failed to load version history", "error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVersions()
  }, [documentId])

  // Restore a previous version
  const handleRestoreVersion = () => {
    if (!quill || !restoreDialog.version) return

    try {
      quill.setContents(restoreDialog.version.content)
      showToast("Document restored to this version", "success")
      setRestoreDialog({ isOpen: false, version: null })
    } catch (err) {
      console.error(err)
      showToast("Failed to restore version", "error")
    }
  }

  // Format date/time
  const formatVersionTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const formatVersionDetails = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <div className={`version-dropdown ${isOpen ? "open" : ""}`}>
        <button
          className="version-dropdown-toggle"
          onClick={() => setIsOpen(prev => !prev)}
        >
          <span className="toggle-icon">⏱</span>
          <span className="toggle-text">
            {isOpen ? "Close" : "History"}
          </span>
        </button>

        <div className="version-panel">
          <div className="version-panel-header">
            <h3 className="version-panel-title">Version History</h3>
            <p className="version-panel-subtitle">
              {versions.length} {versions.length === 1 ? 'snapshot' : 'snapshots'} saved
            </p>
          </div>

          {isLoading ? (
            <div className="version-loading">
              <div className="spinner-mini"></div>
              <p>Loading versions...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="version-empty">
              <p className="empty-icon">📚</p>
              <p className="empty-text">No snapshots yet</p>
              <p className="empty-hint">Versions are saved automatically</p>
            </div>
          ) : (
            <div className="version-list">
              {versions.map((version, index) => (
                <div
                  key={version._id}
                  className="version-item"
                >
                  <div className="version-timeline">
                    <div className="version-dot"></div>
                    {index < versions.length - 1 && <div className="version-line"></div>}
                  </div>

                  <div className="version-content">
                    <div className="version-header">
                      <span className="version-time">
                        {formatVersionTime(version.savedAt)}
                      </span>
                      <span className="version-detail">
                        {formatVersionDetails(version.savedAt)}
                      </span>
                    </div>

                    <button
                      className="version-restore-btn"
                      onClick={() =>
                        setRestoreDialog({
                          isOpen: true,
                          version
                        })
                      }
                    >
                      <span className="restore-icon">↻</span>
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={restoreDialog.isOpen}
        title="Restore Version"
        message="This will replace the current document with this version. Make sure you want to proceed."
        confirmText="Restore Version"
        cancelText="Cancel"
        isDangerous
        isLoading={false}
        onConfirm={handleRestoreVersion}
        onCancel={() => setRestoreDialog({ isOpen: false, version: null })}
      />
    </>
  )
}

export default VersionHistory
