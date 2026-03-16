import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput"
import { showToast } from "../utils/Toast"
import "./Login.css"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast("Please fix the errors above", "error")
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/auth/login",
        formData
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))

      showToast("Welcome back!", "success")
      
      setTimeout(() => {
        navigate("/dashboard")
      }, 300)

    } catch (err) {
      console.error(err)
      
      const errorMessage = err.response?.data?.message || "Login failed. Please try again."
      showToast(errorMessage, "error")
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page-login">
      <div className="auth-card login-card">
        <div className="auth-header">
          <div className="auth-icon">→</div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to your workspace and start collaborating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
            disabled={isLoading}
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />

          {errors.submit && (
            <div className="auth-error-box">
              <span className="error-icon">⚠</span>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>New to our workspace?</span>
        </div>

        <button
          type="button"
          className="auth-link-btn"
          onClick={() => navigate("/register")}
          disabled={isLoading}
        >
          Create a new account instead
        </button>
      </div>

      <div className="auth-decoration" />
    </div>
  )
}

export default Login
