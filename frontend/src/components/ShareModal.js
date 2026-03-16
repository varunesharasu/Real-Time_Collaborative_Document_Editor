import React, { useEffect, useState } from "react"
import axios from "axios"
import FormInput from "./FormInput"
import UserAvatar from "./UserAvatar"
import { showToast } from "../utils/Toast"
import "./ShareModal.css"

/**
 * ShareModal - Manage document collaborators and sharing
 * Allows inviting users by email and managing permissions
 */
function ShareModal({ documentId, onClose }) {
  const [email, setEmail] = useState("")
  const [collaborators, setCollaborators] = useState([])
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false)
  const [emailError, setEmailError] = useState("")

  // Fetch collaborators on mount
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await axios.get(
          `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/collaborators/${documentId}`
        )
        setCollaborators(res.data || [])
      } catch (err) {
        console.error(err)
        showToast("Failed to load collaborators", "error")
      }
    }

    fetchCollaborators()
  }, [documentId])

  // Validate email format
  const validateEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)
  }

  const addCollaborator = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Invalid email format")
      return
    }

    setIsAddingCollaborator(true)
    setEmailError("")

    try {
      await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/add-collaborator",
        {
          documentId,
          email
        }
      )

      showToast(`Invited ${email} to collaborate`, "success")
      setEmail("")

      // Refresh collaborators list
      const res = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/collaborators/${documentId}`
      )
      setCollaborators(res.data || [])

    } catch (err) {
      console.error(err)
      const errorMessage = err.response?.data?.message || "Failed to add collaborator"
      showToast(errorMessage, "error")
      setEmailError(errorMessage)
    } finally {
      setIsAddingCollaborator(false)
    }
  }

  const removeCollaborator = async (userId) => {
    try {
      await axios.delete(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/remove/${documentId}/${userId}`
      )

      setCollaborators(prev => prev.filter(u => u._id !== userId))
      showToast("Collaborator removed", "success")

    } catch (err) {
      console.error(err)
      showToast("Failed to remove collaborator", "error")
    }
  }

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <div>
            <h3 className="share-modal-title">Share Document</h3>
            <p className="share-modal-subtitle">Invite people to collaborate</p>
          </div>
          <button className="share-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={addCollaborator} className="share-form">
          <FormInput
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError("")
            }}
            error={emailError}
            disabled={isAddingCollaborator}
          />

          <button
            type="submit"
            className="share-add-btn"
            disabled={isAddingCollaborator}
          >
            {isAddingCollaborator ? (
              <>
                <span className="btn-spinner-mini"></span>
                Inviting...
              </>
            ) : (
              <>
                <span className="btn-icon">+</span>
                Send Invite
              </>
            )}
          </button>
        </form>

        <div className="share-divider"></div>

        <div className="collaborators-section">
          <h4 className="collaborators-title">
            Active Collaborators ({collaborators.length})
          </h4>

          {collaborators.length === 0 ? (
            <div className="empty-collaborators">
              <p>No collaborators yet. Invite someone to get started!</p>
            </div>
          ) : (
            <div className="collaborators-list">
              {collaborators.map(user => (
                <div key={user._id} className="collaborator-item">
                  <div className="collaborator-info">
                    <UserAvatar
                      username={user.username}
                      email={user.email}
                      size="small"
                      status="online"
                    />
                    <div className="collaborator-details">
                      <p className="collaborator-name">{user.username}</p>
                      <p className="collaborator-email">{user.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="remove-collaborator-btn"
                    onClick={() => removeCollaborator(user._id)}
                    title="Remove collaborator"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal
