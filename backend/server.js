const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const Document = require("./models/Document")

const authRoute = require("./routes/auth")
const documentRoute = require("./routes/documents")
const shareRoute = require("./routes/share")

const app = express()

app.use(cors())
app.use(express.json())

// API Routes
app.use("/api/auth", authRoute)
app.use("/api/documents", documentRoute)
app.use("/api/share", shareRoute)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = 5000
const defaultValue = {}

const onlineUsers = {}

mongoose
  .connect(
    "mongodb+srv://varunesh:varunesh@cluster1.lvoka.mongodb.net/documents?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch(err => console.log(err))

io.on("connection", socket => {

  console.log("User connected:", socket.id)

  socket.on("get-document", async documentId => {

    const document = await findOrCreateDocument(documentId)

    socket.join(documentId)

    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {

      socket.broadcast
        .to(documentId)
        .emit("receive-changes", delta)

    })

    socket.on("save-document", async data => {

      await Document.findByIdAndUpdate(
        documentId,
        { data }
      )

    })

  })

  socket.on("join-document", ({ documentId, user }) => {

    socket.join(documentId)

    if (!onlineUsers[documentId]) {
      onlineUsers[documentId] = []
    }

    const userData = {
      username: user.username,
      socketId: socket.id
    }

    onlineUsers[documentId].push(userData)

    io.to(documentId).emit(
      "online-users",
      onlineUsers[documentId]
    )

  })

  socket.on("disconnect", () => {

    for (const doc in onlineUsers) {

      onlineUsers[doc] =
        onlineUsers[doc].filter(
          u => u.socketId !== socket.id
        )

      io.to(doc).emit(
        "online-users",
        onlineUsers[doc]
      )

    }

    console.log("User disconnected")

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