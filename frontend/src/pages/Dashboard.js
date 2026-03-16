import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"

function Dashboard() {

  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [sharedDocs, setSharedDocs] = useState([])
  const [title, setTitle] = useState("")

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {

    fetchDocuments()

  }, [])

  const fetchDocuments = async () => {

    try {

      // documents owned by user
      const res1 = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/user/${user.id}`
      )

      // documents shared with user
      const res2 = await axios.get(
        `https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/shared/${user.id}`
      )

      setDocuments(res1.data)
      setSharedDocs(res2.data)

    } catch (err) {

      console.log(err)

    }

  }

  const createDocument = async () => {

    try {

      const res = await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/documents/create",
        {
          title,
          userId: user.id
        }
      )

      navigate(`/documents/${res.data._id}`)

    } catch (err) {

      console.log(err)

    }

  }

  const openDocument = (id) => {

    navigate(`/documents/${id}`)

  }

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">
        <p className="dashboard-kicker">Workspace</p>
        <h2 className="dashboard-title">My Documents</h2>
      </div>

      <div className="dashboard-create-doc">

        <input
          placeholder="Document title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <button onClick={createDocument}>
          Create
        </button>

      </div>

      <div className="dashboard-sections">

        <section className="dashboard-section">
          <h3 className="dashboard-section-title">Your Documents</h3>

          {documents.map(doc => (

            <div
              key={doc._id}
              className="dashboard-doc-card"
              onClick={()=>openDocument(doc._id)}
            >

              {doc.title}

            </div>

          ))}
        </section>

        <section className="dashboard-section">
          <h3 className="dashboard-section-title">Shared With You</h3>

          {sharedDocs.map(doc => (

            <div
              key={doc._id}
              className="dashboard-doc-card"
              onClick={()=>openDocument(doc._id)}
            >

              {doc.title}

            </div>

          ))}
        </section>

      </div>

    </div>

  )

}

export default Dashboard