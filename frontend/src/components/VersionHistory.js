import React, { useEffect, useState } from "react"
import axios from "axios"
import "./VersionHistory.css"

function VersionHistory({ documentId, quill }) {

  const [versions, setVersions] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {

    const fetchVersions = async () => {

      const res = await axios.get(
        `http://localhost:5000/api/versions/${documentId}`
      )

      setVersions(res.data)

    }

    fetchVersions()

  }, [documentId])

  const restoreVersion = (content) => {

    if (!quill) return

    quill.setContents(content)

  }

  return (

    <div className={`version-dropdown ${isOpen ? "open" : ""}`}>

      <button
        className="version-dropdown-toggle"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? "Hide Version History" : "Version History"}
      </button>

      <div className="version-panel">

        <h3>Version History</h3>

        {versions.length === 0 && (
          <p className="version-empty">No snapshots available yet.</p>
        )}

        {versions.map(v => (

          <div
            key={v._id}
            className="version-item"
          >

            <span>
              {new Date(v.savedAt).toLocaleString()}
            </span>

            <button
              onClick={()=>restoreVersion(v.content)}
            >
              Restore
            </button>

          </div>

        ))}

      </div>

    </div>

  )

}

export default VersionHistory