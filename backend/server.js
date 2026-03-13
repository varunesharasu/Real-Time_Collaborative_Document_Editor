const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const Document = require("./models/Document")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const defaultValue = ""

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://varunesh:varunesh@cluster1.lvoka.mongodb.net/documents?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch(error => {
    console.error("MongoDB connection error:", error)
  })

const PORT = 5000

io.on("connection", socket => {

  socket.on("get-document", async documentId => {

    const document = await findOrCreateDocument(documentId)

    socket.join(documentId)

    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {

  if (id == null) return

  const document = await Document.findById(id)

  if (document) return document

  return await Document.create({
    _id: id,
    data: defaultValue
  })
}

server.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})