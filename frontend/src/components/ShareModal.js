import React, { useEffect, useState } from "react"
import axios from "axios"
import "./ShareModal.css"

function ShareModal({ documentId, onClose }) {

  const [email, setEmail] = useState("")
  const [collaborators, setCollaborators] = useState([])

  useEffect(() => {

    const fetchCollaborators = async () => {

      const res = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/collaborators/${documentId}`
      )

      setCollaborators(res.data)

    }

    fetchCollaborators()

  }, [documentId])

  const fetchCollaborators = async () => {

    const res = await axios.get(
      `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/collaborators/${documentId}`
    )

    setCollaborators(res.data)

  }

  const addCollaborator = async () => {

    await axios.post(
      "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/add-collaborator",
      {
        documentId,
        email
      }
    )

    setEmail("")
    fetchCollaborators()

  }

  const removeCollaborator = async (userId) => {

    await axios.delete(
      `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/share/remove/${documentId}/${userId}`
    )

    fetchCollaborators()

  }

  return (

    <div
      className="share-modal-overlay"
      onClick={onClose}
    >

      <div
        className="share-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="share-modal-header">
          <h3>Share Document</h3>

          <button
            className="share-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <input
          placeholder="User email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          className="share-add-btn"
          onClick={addCollaborator}
        >
          Add
        </button>

        <h4>Collaborators</h4>

        {collaborators.map(user => (

          <div
            key={user._id}
            className="collaborator-row"
          >

            <span>
              {user.username} ({user.email})
            </span>

            <button
              className="share-remove-btn"
              onClick={()=>removeCollaborator(user._id)}
            >
              Remove
            </button>

          </div>

        ))}

      </div>

    </div>

  )

}

export default ShareModal