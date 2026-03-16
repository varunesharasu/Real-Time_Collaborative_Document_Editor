import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Register.css"

function Register() {

  const navigate = useNavigate()

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/auth/register",
        user
      )

      alert("User registered successfully")

      navigate("/")

    } catch (err) {

      console.log(err)

    }

  }

  return (
    <div className="auth-page auth-page-register">

      <div className="register-page auth-card">

        <p className="auth-eyebrow">Create Account</p>
        <h2>Join the Team</h2>
        <p className="auth-subtitle">Start collaborating on documents in real-time.</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Register</button>

        </form>

      </div>

    </div>
  )

}

export default Register