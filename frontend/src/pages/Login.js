import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Login.css"

function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email,
          password: password
        }
      )

      // Save token
      localStorage.setItem("token", res.data.token)

      // Save user data
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      alert("Login successful")

      navigate("/dashboard")

    } catch (err) {

      console.error(err)

      alert("Login failed")

    }

  }

  return (

    <div className="login-page">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Login
        </button>

      </form>

      <p
        className="login-switch-link"
        onClick={() => navigate("/register")}
      >
        Create a new account
      </p>

    </div>

  )

}

export default Login