import React, { useEffect, useState } from "react"
import axios from "axios"
import "./ShareModal.css"

function ShareModal({ documentId }) {

  const [email, setEmail] = useState("")
  const [collaborators, setCollaborators] = useState([])

  useEffect(() => {

    fetchCollaborators()

  }, [])

  const fetchCollaborators = async () => {

    const res = await axios.get(
      `http://localhost:5000/api/share/collaborators/${documentId}`
    )

    setCollaborators(res.data)

  }

  const addCollaborator = async () => {

    await axios.post(
      "http://localhost:5000/api/share/add-collaborator",
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
      `http://localhost:5000/api/share/remove/${documentId}/${userId}`
    )

    fetchCollaborators()

  }

  return (

    <div className="share-modal">

      <h3>Share Document</h3>

      <input
        placeholder="User email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <button onClick={addCollaborator}>
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
            onClick={()=>removeCollaborator(user._id)}
          >
            Remove
          </button>

        </div>

      ))}

    </div>

  )

}

export default ShareModal