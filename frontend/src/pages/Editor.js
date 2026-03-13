import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import TextEditor from "../components/TextEditor"
import ShareModal from "../components/ShareModal"
import OnlineUsers from "../components/OnlineUsers"

function Editor() {

  const { id } = useParams()

  const [title, setTitle] = useState("")
  const [showShare, setShowShare] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {

    const fetchDoc = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/api/documents/${id}`
        )

        if (res.data.title) {
          setTitle(res.data.title)
        }

      } catch (err) {
        console.log(err)
      }

    }

    fetchDoc()

  }, [id])

  const updateTitle = async () => {

    try {

      await axios.put(
        `http://localhost:5000/api/documents/title/${id}`,
        { title }
      )

    } catch (err) {
      console.log(err)
    }

  }

  return (

    <div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #ddd"
        }}
      >

        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          onBlur={updateTitle}
          style={{
            fontSize:"18px",
            padding:"5px"
          }}
        />

        <button
          onClick={()=>setShowShare(true)}
        >
          Share
        </button>

      </div>

      {showShare && (
        <ShareModal
          documentId={id}
        />
      )}

      <OnlineUsers users={onlineUsers} />

      <TextEditor
        documentId={id}
        setOnlineUsers={setOnlineUsers}
      />

    </div>

  )

}

export default Editor