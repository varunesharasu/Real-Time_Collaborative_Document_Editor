/**
 * FormattingService - Google Docs-like text formatting utilities
 * Provides advanced text styling, formatting suggestions, and enhancements
 */

class FormattingService {
  /**
   * Apply heading levels (H1, H2, H3)
   */
  static getHeadingFormats() {
    return [
      { label: "Normal text", value: false },
      { label: "Heading 1", value: "h1" },
      { label: "Heading 2", value: "h2" },
      { label: "Heading 3", value: "h3" }
    ]
  }

  /**
   * Get available text colors
   */
  static getTextColors() {
    return [
      { name: "Default", value: "#000000" },
      { name: "Dark Gray", value: "#434343" },
      { name: "Gray", value: "#666666" },
      { name: "Light Gray", value: "#999999" },
      { name: "Blue", value: "#3b82f6" },
      { name: "Red", value: "#ef4444" },
      { name: "Yellow", value: "#f59e0b" },
      { name: "Green", value: "#10b981" },
      { name: "Purple", value: "#8b5cf6" }
    ]
  }

  /**
   * Get available highlight colors
   */
  static getHighlightColors() {
    return [
      { name: "None", value: null },
      { name: "Yellow", value: "#fbbf24" },
      { name: "Green", value: "#bbf7d0" },
      { name: "Blue", value: "#bfdbfe" },
      { name: "Red", value: "#fecaca" },
      { name: "Purple", value: "#e9d5ff" }
    ]
  }

  /**
   * Get font options
   */
  static getFontOptions() {
    return [
      "Arial",
      "Calibri",
      "Courier New",
      "Georgia",
      "Helvetica",
      "Times New Roman",
      "Trebuchet MS",
      "Verdana"
    ]
  }

  /**
   * Get font sizes
   */
  static getFontSizes() {
    return [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48]
  }

  /**
   * Get line spacing options
   */
  static getLineSpacingOptions() {
    return [
      { label: "Single", value: 1.0 },
      { label: "1.15", value: 1.15 },
      { label: "1.5", value: 1.5 },
      { label: "Double", value: 2.0 }
    ]
  }

  /**
   * Auto-correct common spelling mistakes
   */
  static autoCorrect(text) {
    const corrections = {
      "teh ": "the ",
      "adn ": "and ",
      "tha ": "that ",
      "becuase": "because",
      "recieve": "receive",
      "occured": "occurred",
      "seperete": "separate",
      "definately": "definitely"
    }

    let corrected = text
    Object.entries(corrections).forEach(([wrong, right]) => {
      const regex = new RegExp(wrong, "gi")
      corrected = corrected.replace(regex, right)
    })

    return corrected
  }

  /**
   * Format text with proper capitalization
   */
  static formatCapitalization(text, style = "sentence") {
    switch (style) {
      case "sentence":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

      case "title":
        return text
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")

      case "uppercase":
        return text.toUpperCase()

      case "lowercase":
        return text.toLowerCase()

      default:
        return text
    }
  }

  /**
   * Remove extra whitespace and format document
   */
  static cleanDocument(text) {
    return text
      .replace(/\s+/g, " ")
      .replace(/\n\s+/g, "\n")
      .trim()
  }

  /**
   * Generate table of contents from headings
   */
  static generateTableOfContents(content) {
    const headingRegex = /<h([1-3])>(.*?)<\/h\1>/gi
    const toc = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1])
      const text = match[2].replace(/<[^>]*>/g, "").trim()

      toc.push({
        level,
        text,
        id: `heading-${toc.length}`
      })
    }

    return toc
  }

  /**
   * Get text formatting suggestions based on content
   */
  static getFormattingSuggestions(text) {
    const suggestions = []

    // Check for long paragraphs
    const paragraphs = text.split("\n").filter(p => p.trim())
    const avgLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length

    if (avgLength > 150) {
      suggestions.push({
        type: "warning",
        message: "Some paragraphs are very long. Consider breaking them into shorter paragraphs."
      })
    }

    // Check for proper punctuation
    if (!/[.!?]$/.test(text)) {
      suggestions.push({
        type: "hint",
        message: "Document doesn't end with proper punctuation."
      })
    }

    // Check for consistent formatting
    const bulletCount = (text.match(/^[\s]*[-*]/gm) || []).length
    if (bulletCount > 0 && bulletCount < paragraphs.length * 0.3) {
      suggestions.push({
        type: "hint",
        message: "Consider using bullet points for better readability."
      })
    }

    return suggestions
  }

  /**
   * Format numbers with thousands separator
   */
  static formatNumber(num, locale = "en-US") {
    return num.toLocaleString(locale)
  }

  /**
   * Generate word frequency analysis
   */
  static analyzeWordFrequency(text, topN = 10) {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3)

    const frequency = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, count]) => ({ word, count }))
  }
}

export default FormattingService
