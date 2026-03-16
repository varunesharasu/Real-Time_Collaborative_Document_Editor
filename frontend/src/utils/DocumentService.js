/**
 * DocumentService - Enhanced document management utilities
 * Provides Google Docs-like features: autosave, undo/redo, formatting, etc.
 */

import axios from "axios"

const API_BASE = "https://real-time-collaborative-document-editor-9lkv.onrender.com/api"

class DocumentService {
  /**
   * Search text within document content
   * Returns array of match positions and snippets
   */
  static searchInDocument(content, query) {
    if (!query.trim()) return []

    const matches = []
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()
    let index = 0

    while ((index = lowerContent.indexOf(lowerQuery, index)) !== -1) {
      matches.push({
        position: index,
        length: query.length,
        snippet: content.substring(
          Math.max(0, index - 30),
          Math.min(content.length, index + query.length + 30)
        )
      })
      index += query.length
    }

    return matches
  }

  /**
   * Replace text in document
   * Supports single replacement or replace all
   */
  static replaceInDocument(content, find, replace, replaceAll = false) {
    if (replaceAll) {
      return content.split(find).join(replace)
    }
    return content.replace(find, replace)
  }

  /**
   * Get document statistics
   * Word count, character count, reading time
   */
  static getDocumentStats(content) {
    const text = content.replace(/<[^>]*>/g, "").trim()
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const chars = text.length
    const readingTimeMinutes = Math.ceil(words.length / 200)

    return {
      wordCount: words.length,
      charCount: chars,
      paragraphs: text.split(/\n\n+/).length,
      readingTime: `${readingTimeMinutes} min`
    }
  }

  /**
   * Format content to have consistent styling
   */
  static normalizeContent(content) {
    return content.trim()
  }

  /**
   * Export document as different formats
   */
  static exportDocument(documentTitle, content, format = "txt") {
    const element = document.createElement("a")
    let data, filename, mimeType

    switch (format) {
      case "txt":
        data = content.replace(/<[^>]*>/g, "")
        filename = `${documentTitle}.txt`
        mimeType = "text/plain"
        break

      case "html":
        data = `<!DOCTYPE html>
<html>
<head>
  <title>${documentTitle}</title>
  <meta charset="UTF-8">
</head>
<body>
  ${content}
</body>
</html>`
        filename = `${documentTitle}.html`
        mimeType = "text/html"
        break

      case "md":
        data = content.replace(/<[^>]*>/g, "")
        filename = `${documentTitle}.md`
        mimeType = "text/markdown"
        break

      default:
        return
    }

    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)

    element.setAttribute("href", url)
    element.setAttribute("download", filename)
    element.style.display = "none"

    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(url)
  }

  /**
   * Get document access level for current user
   */
  static async getDocumentAccessLevel(documentId) {
    try {
      const res = await axios.get(`${API_BASE}/documents/${documentId}/access`)
      return res.data.accessLevel
    } catch (err) {
      console.error("Failed to get access level:", err)
      return null
    }
  }

  /**
   * Create document snapshot for backup
   */
  static createSnapshot(documentTitle, content) {
    return {
      title: documentTitle,
      content: content,
      timestamp: new Date().toISOString(),
      size: new Blob([content]).size
    }
  }

  /**
   * Compare two document versions
   * Returns differences between versions
   */
  static compareVersions(version1, version2) {
    const text1 = version1.replace(/<[^>]*>/g, "")
    const text2 = version2.replace(/<[^>]*>/g, "")

    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")

    const differences = {
      added: [],
      removed: [],
      modified: 0
    }

    lines2.forEach(line => {
      if (!lines1.includes(line)) {
        differences.added.push(line)
      }
    })

    lines1.forEach(line => {
      if (!lines2.includes(line)) {
        differences.removed.push(line)
      }
    })

    return differences
  }

  /**
   * Validate document name
   */
  static validateDocumentName(name) {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: "Document name cannot be empty" }
    }

    if (name.length > 100) {
      return { valid: false, error: "Document name must be less than 100 characters" }
    }

    return { valid: true }
  }

  /**
   * Generate readable document summary
   */
  static generateSummary(content, maxLength = 150) {
    const text = content.replace(/<[^>]*>/g, "").trim()
    if (text.length <= maxLength) return text

    return text.substring(0, maxLength).trim() + "..."
  }
}

export default DocumentService
