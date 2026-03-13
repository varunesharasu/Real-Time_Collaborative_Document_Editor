import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Dashboard() {

  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {

    const fetchDocs = async () => {

      const res = await axios.get(
        `http://localhost:5000/api/documents/user/${user.id}`
      )

      setDocuments(res.data)

    }

    fetchDocs()

  }, [])

  const createDocument = async () => {

    const res = await axios.post(
      "http://localhost:5000/api/documents/create",
      {
        title: "New Document",
        userId: user.id
      }
    )

    navigate(`/documents/${res.data._id}`)

  }

  return (

    <div className="dashboard">

      <h1>Your Documents</h1>

      <button onClick={createDocument}>
        Create New Document
      </button>

      <ul>

        {documents.map(doc => (

          <li
            key={doc._id}
            onClick={() => navigate(`/documents/${doc._id}`)}
          >

            {doc.title}

          </li>

        ))}

      </ul>

    </div>

  )

}

export default Dashboard