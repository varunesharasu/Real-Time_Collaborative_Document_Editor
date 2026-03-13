const router = require("express").Router()
const Document = require("../models/Document")

router.post("/create", async (req, res) => {

  try {

    const newDoc = new Document({
      title: req.body.title,
      owner: req.body.userId
    })

    const savedDoc = await newDoc.save()

    res.json(savedDoc)

  } catch (err) {

    res.status(500).json(err)

  }

})

router.get("/user/:userId", async (req, res) => {

  try {

    const docs = await Document.find({
      owner: req.params.userId
    })

    res.json(docs)

  } catch (err) {

    res.status(500).json(err)

  }

})

module.exports = router