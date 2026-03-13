const mongoose = require("mongoose")

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Document"
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  data: {
    type: Object,
    default: {}
  }
})

module.exports = mongoose.model("Document", DocumentSchema)