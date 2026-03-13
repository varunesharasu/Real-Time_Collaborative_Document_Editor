const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const JWT_SECRET = "secret123"

router.post("/register", async (req, res) => {

  try {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json("User created")

  } catch (err) {

    res.status(500).json(err)

  }

})

router.post("/login", async (req, res) => {

  try {

    const user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(404).json("User not found")

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!validPassword)
      return res.status(400).json("Wrong password")

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })

  } catch (err) {

    res.status(500).json(err)

  }

})

module.exports = router