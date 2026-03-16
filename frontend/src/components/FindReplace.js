import React, { useState, useCallback } from "react"
import DocumentService from "../utils/DocumentService"
import { showToast } from "../utils/Toast"
import "./FindReplace.css"

/**
 * FindReplace - Google Docs-like find and replace functionality
 * Allows searching and replacing text within the document
 */
function FindReplace({ isOpen, onClose, quill }) {
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [matchCount, setMatchCount] = useState(0)
  const [currentMatch, setCurrentMatch] = useState(0)

  // Search document when find text changes
  const handleSearch = useCallback(() => {
    if (!findText.trim() || !quill) {
      setMatchCount(0)
      setCurrentMatch(0)
      return
    }

    const content = quill.getText()
    const matches = DocumentService.searchInDocument(content, findText)
    setMatchCount(matches.length)
    setCurrentMatch(matches.length > 0 ? 1 : 0)
  }, [findText, quill])

  const handleReplace = useCallback(() => {
    if (!quill || !findText.trim()) {
      showToast("Please enter text to find", "warning")
      return
    }

    const content = quill.getText()
    const newContent = DocumentService.replaceInDocument(
      content,
      findText,
      replaceText,
      false
    )

    if (newContent !== content) {
      quill.setContents(quill.getContents())
      showToast("Text replaced", "success")
    } else {
      showToast("Text not found", "warning")
    }
  }, [quill, findText, replaceText])

  const handleReplaceAll = useCallback(() => {
    if (!quill || !findText.trim()) {
      showToast("Please enter text to find", "warning")
      return
    }

    const content = quill.getText()
    const newContent = DocumentService.replaceInDocument(
      content,
      findText,
      replaceText,
      true
    )

    if (newContent !== content) {
      quill.setContents(quill.getContents())
      const count = (content.match(new RegExp(findText, "g")) || []).length
      showToast(`Replaced ${count} occurrences`, "success")
    } else {
      showToast("Text not found", "warning")
    }
  }, [quill, findText, replaceText])

  if (!isOpen) return null

  return (
    <div className="find-replace-panel">
      <div className="find-replace-header">
        <h4>Find & Replace</h4>
        <button className="find-replace-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="find-replace-content">
        <div className="find-replace-group">
          <label className="find-replace-label">Find</label>
          <div className="find-replace-input-wrapper">
            <input
              type="text"
              className="find-replace-input"
              placeholder="Search text..."
              value={findText}
              onChange={(e) => {
                setFindText(e.target.value)
              }}
              onKeyUp={handleSearch}
            />
            {matchCount > 0 && (
              <span className="match-indicator">
                {currentMatch} of {matchCount}
              </span>
            )}
          </div>
        </div>

        <div className="find-replace-group">
          <label className="find-replace-label">Replace with</label>
          <input
            type="text"
            className="find-replace-input"
            placeholder="Replacement text..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
          />
        </div>

        <div className="find-replace-buttons">
          <button
            className="find-replace-btn btn-replace"
            onClick={handleReplace}
            disabled={!findText.trim()}
          >
            Replace
          </button>
          <button
            className="find-replace-btn btn-replace-all"
            onClick={handleReplaceAll}
            disabled={!findText.trim()}
          >
            Replace All
          </button>
        </div>

        {matchCount === 0 && findText && (
          <p className="no-matches">No matches found</p>
        )}
      </div>
    </div>
  )
}

export default FindReplace
