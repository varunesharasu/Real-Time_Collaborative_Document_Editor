const router = require("express").Router()
const Document = require("../models/Document")
const User = require("../models/User")

router.post("/add-collaborator", async (req, res) => {

  try {

    const { documentId, email } = req.body

    const user = await User.findOne({ email })

    if (!user)
      return res.status(404).json("User not found")

    const doc = await Document.findById(documentId)

    if (!doc)
      return res.status(404).json("Document not found")

    if (!doc.collaborators.includes(user._id)) {

      doc.collaborators.push(user._id)

      await doc.save()

    }

    res.json("Collaborator added")

  } catch (err) {

    res.status(500).json(err)

  }

})

router.get("/collaborators/:documentId", async (req, res) => {

  try {

    const doc = await Document.findById(req.params.documentId)
      .populate("collaborators", "username email")

    res.json(doc.collaborators)

  } catch (err) {

    res.status(500).json(err)

  }

})

router.delete("/remove/:documentId/:userId", async (req, res) => {

  try {

    const doc = await Document.findById(req.params.documentId)

    doc.collaborators =
      doc.collaborators.filter(
        id => id.toString() !== req.params.userId
      )

    await doc.save()

    res.json("Collaborator removed")

  } catch (err) {

    res.status(500).json(err)

  }

})

module.exports = router