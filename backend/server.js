const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

// Models
const Document = require("./models/Document")
const Version = require("./models/Version")

// Routes
const authRoute = require("./routes/auth")
const documentRoute = require("./routes/documents")
const shareRoute = require("./routes/share")
const versionRoute = require("./routes/version")

const app = express()

app.use(cors())
app.use(express.json())

// API Routes
app.use("/api/auth", authRoute)
app.use("/api/documents", documentRoute)
app.use("/api/share", shareRoute)
app.use("/api/versions", versionRoute)

// HTTP server
const server = http.createServer(app)

// Socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = 5000
const defaultValue = {}

// Track users per document
const onlineUsers = {}

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://varunesh:varunesh@cluster1.lvoka.mongodb.net/documents?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch(err => {
    console.log("MongoDB error:", err)
  })


// SOCKET.IO
io.on("connection", socket => {

  console.log("User connected:", socket.id)



  // LOAD DOCUMENT
  socket.on("get-document", async documentId => {

    const document = await findOrCreateDocument(documentId)

    socket.join(documentId)

    socket.emit("load-document", document.data)



    // RECEIVE CHANGES
    socket.on("send-changes", delta => {

      socket.broadcast
        .to(documentId)
        .emit("receive-changes", delta)

    })



    // AUTOSAVE
    socket.on("save-document", async data => {

      await Document.findByIdAndUpdate(
        documentId,
        { data }
      )

      // Save version snapshot
      await Version.create({
        documentId: documentId,
        content: data
      })

    })

  })



  // JOIN DOCUMENT (ONLINE USERS)
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



  // CURSOR TRACKING
  socket.on("cursor-change", data => {

    const { documentId, user, range } = data

    socket.broadcast
      .to(documentId)
      .emit("receive-cursor", {
        user,
        range,
        socketId: socket.id
      })

  })



  // DISCONNECT
  socket.on("disconnect", () => {

    for (const docId in onlineUsers) {

      onlineUsers[docId] =
        onlineUsers[docId].filter(
          u => u.socketId !== socket.id
        )

      io.to(docId).emit(
        "online-users",
        onlineUsers[docId]
      )

    }

    console.log("User disconnected:", socket.id)

  })

})



// FIND OR CREATE DOCUMENT
async function findOrCreateDocument(id) {

  if (id == null) return

  const document = await Document.findById(id)

  if (document) return document

  return await Document.create({
    _id: id,
    data: defaultValue
  })

}


// START SERVER
server.listen(PORT, () => {

  console.log("Server running on port " + PORT)

})