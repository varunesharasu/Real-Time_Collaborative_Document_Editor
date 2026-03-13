import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
        `http://localhost:5000/api/documents/user/${user.id}`
      )

      // documents shared with user
      const res2 = await axios.get(
        `http://localhost:5000/api/documents/shared/${user.id}`
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
        "http://localhost:5000/api/documents/create",
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

    <div className="dashboard">

      <h2>My Documents</h2>

      <div className="create-doc">

        <input
          placeholder="Document title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <button onClick={createDocument}>
          Create
        </button>

      </div>

      <h3>Your Documents</h3>

      {documents.map(doc => (

        <div
          key={doc._id}
          className="doc-card"
          onClick={()=>openDocument(doc._id)}
        >

          {doc.title}

        </div>

      ))}

      <h3>Shared With You</h3>

      {sharedDocs.map(doc => (

        <div
          key={doc._id}
          className="doc-card"
          onClick={()=>openDocument(doc._id)}
        >

          {doc.title}

        </div>

      ))}

    </div>

  )

}

export default Dashboard