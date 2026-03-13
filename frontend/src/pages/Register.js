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
        "http://localhost:5000/api/auth/register",
        user
      )

      alert("User registered successfully")

      navigate("/")

    } catch (err) {

      console.log(err)

    }

  }

  return (
    <div className="register-page">

      <h2>Register</h2>

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
  )

}

export default Register