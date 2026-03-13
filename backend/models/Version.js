const mongoose = require("mongoose")

const VersionSchema = new mongoose.Schema({

  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document"
  },

  content: {
    type: Object
  },

  savedAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model("Version", VersionSchema)