// const router = require("express").Router()
// const Document = require("../models/Document")

// router.post("/create", async (req, res) => {

//   try {

//     const newDoc = new Document({
//       title: req.body.title,
//       owner: req.body.userId
//     })

//     const savedDoc = await newDoc.save()

//     res.json(savedDoc)

//   } catch (err) {

//     res.status(500).json(err)

//   }

// })

// router.get("/user/:userId", async (req, res) => {

//   try {

//     const docs = await Document.find({
//       owner: req.params.userId
//     })

//     res.json(docs)

//   } catch (err) {

//     res.status(500).json(err)

//   }

// })

// router.get("/shared/:userId", async (req, res) => {

//   try {

//     const docs = await Document.find({
//       collaborators: req.params.userId
//     })

//     res.json(docs)

//   } catch (err) {

//     res.status(500).json(err)

//   }

// })

// router.put("/title/:id", async (req, res) => {

//   try {

//     const updatedDoc = await Document.findByIdAndUpdate(
//       req.params.id,
//       { title: req.body.title },
//       { new: true }
//     )

//     res.json(updatedDoc)

//   } catch (err) {

//     res.status(500).json(err)

//   }

// })

// module.exports = router










const router = require("express").Router()
const Document = require("../models/Document")

router.post("/create", async (req, res) => {

  const doc = new Document({
    title: req.body.title,
    owner: req.body.userId
  })

  const saved = await doc.save()

  res.json(saved)

})

router.get("/user/:userId", async (req, res) => {

  const docs = await Document.find({
    owner: req.params.userId
  })

  res.json(docs)

})

router.get("/shared/:userId", async (req, res) => {

  const docs = await Document.find({
    collaborators: req.params.userId
  })

  res.json(docs)

})

router.put("/title/:id", async (req, res) => {

  const updated = await Document.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title },
    { new: true }
  )

  res.json(updated)

})

module.exports = router