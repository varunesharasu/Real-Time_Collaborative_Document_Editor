import React, { useState } from "react"
import axios from "axios"

function ShareModal({ documentId }) {

  const [email, setEmail] = useState("")

  const shareDoc = async () => {

    await axios.post(
      "http://localhost:5000/api/share/add-collaborator",
      {
        documentId,
        email
      }
    )

    alert("Collaborator added")

  }

  return (

    <div className="share-box">

      <h3>Share Document</h3>

      <input
        placeholder="Enter user email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={shareDoc}>
        Share
      </button>

    </div>

  )

}

export default ShareModal