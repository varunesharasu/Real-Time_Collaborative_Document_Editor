const router = require("express").Router()
const Version = require("../models/Version")

router.get("/:documentId", async (req, res) => {

  try {

    const versions = await Version.find({
      documentId: req.params.documentId
    }).sort({ savedAt: -1 })

    res.json(versions)

  } catch (err) {

    res.status(500).json(err)

  }

})

module.exports = router