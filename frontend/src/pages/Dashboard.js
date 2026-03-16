import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import FormInput from "../components/FormInput"
import ConfirmDialog from "../components/ConfirmDialog"
import { showToast } from "../utils/Toast"
import "./Dashboard.css"

function Dashboard() {
  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [sharedDocs, setSharedDocs] = useState([])
  const [newDocTitle, setNewDocTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, docId: null })

  const user = JSON.parse(localStorage.getItem("user"))

  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Fetch documents owned by user
      const res1 = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/user/${user.id}`
      )

      // Fetch documents shared with user
      const res2 = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/shared/${user.id}`
      )

      setDocuments(res1.data || [])
      setSharedDocs(res2.data || [])
    } catch (err) {
      console.error(err)
      showToast("Failed to load documents", "error")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const createDocument = async (e) => {
    e.preventDefault()

    if (!newDocTitle.trim()) {
      showToast("Please enter a document title", "warning")
      return
    }

    setIsCreating(true)

    try {
      const res = await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/create",
        {
          title: newDocTitle,
          userId: user.id
        }
      )

      showToast("Document created!", "success")
      setNewDocTitle("")
      
      setTimeout(() => {
        navigate(`/documents/${res.data._id}`)
      }, 300)

    } catch (err) {
      console.error(err)
      showToast("Failed to create document", "error")
    } finally {
      setIsCreating(false)
    }
  }

  const openDocument = (id) => {
    navigate(`/documents/${id}`)
  }

  const deleteDocument = async (docId) => {
    try {
      await axios.delete(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/${docId}`
      )
      setDocuments(prev => prev.filter(doc => doc._id !== docId))
      showToast("Document deleted", "success")
    } catch (err) {
      console.error(err)
      showToast("Failed to delete document", "error")
    } finally {
      setDeleteDialog({ isOpen: false, docId: null })
    }
  }

  // Filter documents based on search
  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSharedDocs = sharedDocs.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`

    return date.toLocaleDateString()
  }

  if (isLoading) {
    return <LoadingSpinner variant="overlay" message="Loading your documents..." />
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Workspace</p>
          <h1 className="dashboard-title">My Documents</h1>
        </div>
        <div className="dashboard-user-info">
          <span className="user-name">{user?.username || "User"}</span>
          <button
            className="dashboard-logout-btn"
            onClick={() => {
              localStorage.clear()
              navigate("/")
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Create Document Section */}
      <section className="create-document-section">
        <form onSubmit={createDocument} className="create-document-form">
          <FormInput
            placeholder="Document title (e.g., Q1 Meeting Notes)"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
            disabled={isCreating}
          />
          <button
            type="submit"
            className="create-doc-btn"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="spinner-mini"></span>
                Creating...
              </>
            ) : (
              <>
                <span className="btn-icon">+</span>
                New Document
              </>
            )}
          </button>
        </form>
      </section>

      {/* Search Bar */}
      {(documents.length > 0 || sharedDocs.length > 0) && (
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      )}

      {/* Your Documents Section */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">
            Your Documents
            {documents.length > 0 && <span className="doc-count">{documents.length}</span>}
          </h2>
        </div>

        {filteredDocs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <p className="empty-title">No documents yet</p>
            <p className="empty-text">Create your first document to get started</p>
          </div>
        ) : (
          <div className="doc-grid">
            {filteredDocs.map(doc => (
              <div
                key={doc._id}
                className="doc-card"
                onClick={() => openDocument(doc._id)}
              >
                <div className="doc-card-header">
                  <div className="doc-icon">📝</div>
                  <button
                    className="doc-card-menu"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteDialog({ isOpen: true, docId: doc._id })
                    }}
                  >
                    ⋮
                  </button>
                </div>
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-date">Updated {formatDate(doc.updatedAt || doc.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shared Documents Section */}
      {sharedDocs.length > 0 && (
        <section className="dashboard-section shared-section">
          <div className="section-header">
            <h2 className="section-title">
              Shared With You
              {sharedDocs.length > 0 && <span className="doc-count">{sharedDocs.length}</span>}
            </h2>
          </div>

          <div className="doc-grid">
            {filteredSharedDocs.map(doc => (
              <div
                key={doc._id}
                className="doc-card shared-badge"
                onClick={() => openDocument(doc._id)}
              >
                <div className="doc-card-header">
                  <div className="doc-icon">👥</div>
                  <span className="shared-indicator">Shared</span>
                </div>
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-date">Updated {formatDate(doc.updatedAt || doc.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        isLoading={false}
        onConfirm={() => deleteDocument(deleteDialog.docId)}
        onCancel={() => setDeleteDialog({ isOpen: false, docId: null })}
      />
    </div>
  )
}

export default Dashboard
