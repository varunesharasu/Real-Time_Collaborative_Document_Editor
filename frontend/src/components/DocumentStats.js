import React, { useState, useMemo } from "react"
import DocumentService from "../utils/DocumentService"
import FormattingService from "../utils/FormattingService"
import "./DocumentStats.css"

/**
 * DocumentStats - Display document analytics
 * Shows word count, character count, reading time, and suggestions
 */
function DocumentStats({ content, isOpen, onClose }) {
  const stats = useMemo(() => DocumentService.getDocumentStats(content), [content])
  const suggestions = useMemo(() => FormattingService.getFormattingSuggestions(content), [content])
  const wordFrequency = useMemo(() => FormattingService.analyzeWordFrequency(content, 5), [content])

  if (!isOpen) return null

  return (
    <div className="doc-stats-overlay" onClick={onClose}>
      <div className="doc-stats-panel" onClick={(e) => e.stopPropagation()}>
        <div className="stats-header">
          <h3>Document Statistics</h3>
          <button className="stats-close" onClick={onClose}>✕</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div className="stat-content">
              <p className="stat-label">Words</p>
              <p className="stat-value">{stats.wordCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🔤</span>
            <div className="stat-content">
              <p className="stat-label">Characters</p>
              <p className="stat-value">{stats.charCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📖</span>
            <div className="stat-content">
              <p className="stat-label">Reading Time</p>
              <p className="stat-value">{stats.readingTime}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">¶</span>
            <div className="stat-content">
              <p className="stat-label">Paragraphs</p>
              <p className="stat-value">{stats.paragraphs}</p>
            </div>
          </div>
        </div>

        {wordFrequency.length > 0 && (
          <div className="word-frequency">
            <h4>Most Used Words</h4>
            <ul className="frequency-list">
              {wordFrequency.map((item, idx) => (
                <li key={idx}>
                  <span className="word">{item.word}</span>
                  <span className="count">{item.count}x</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="formatting-suggestions">
            <h4>Writing Suggestions</h4>
            <ul className="suggestions-list">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className={`suggestion suggestion-${suggestion.type}`}>
                  <span className="suggestion-icon">
                    {suggestion.type === "warning" ? "⚠" : "💡"}
                  </span>
                  {suggestion.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentStats
