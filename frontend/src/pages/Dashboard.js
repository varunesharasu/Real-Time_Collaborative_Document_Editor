import React from "react"
import { useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from "uuid"

function Dashboard() {

  const navigate = useNavigate()

  const createDocument = () => {

    const id = uuidV4()

    navigate(`/documents/${id}`)

  }

  return (
    <div className="dashboard">

      <h1>Dashboard</h1>

      <button onClick={createDocument}>
        Create New Document
      </button>

    </div>
  )

}

export default Dashboard