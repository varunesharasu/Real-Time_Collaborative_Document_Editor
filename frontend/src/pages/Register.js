import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import FormInput from "../components/FormInput"
import { showToast } from "../utils/Toast"
import "./Register.css"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, _ and -"
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }

    // Calculate password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
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
      const submitData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }

      await axios.post(
        "https://real-time-collaborative-document-editor-9lkv.onrender.com/api/auth/register",
        submitData
      )

      showToast("Account created successfully! Redirecting to login...", "success")
      
      setTimeout(() => {
        navigate("/")
      }, 1000)

    } catch (err) {
      console.error(err)
      
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
      showToast(errorMessage, "error")
      
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "#ef4444"
    if (passwordStrength === 2) return "#f59e0b"
    if (passwordStrength === 3) return "#3b82f6"
    return "#10b981"
  }

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="auth-icon">+</div>
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">
            Join our workspace and start collaborating in real-time
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            label="Username"
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
            disabled={isLoading}
          />

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

          <div className="password-input-wrapper">
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bars">
                  <div className="strength-bar" style={{
                    backgroundColor: passwordStrength > 0 ? getPasswordStrengthColor() : '#e2e8f0'
                  }}></div>
                  <div className="strength-bar" style={{
                    backgroundColor: passwordStrength > 1 ? getPasswordStrengthColor() : '#e2e8f0'
                  }}></div>
                  <div className="strength-bar" style={{
                    backgroundColor: passwordStrength > 2 ? getPasswordStrengthColor() : '#e2e8f0'
                  }}></div>
                  <div className="strength-bar" style={{
                    backgroundColor: passwordStrength > 3 ? getPasswordStrengthColor() : '#e2e8f0'
                  }}></div>
                </div>
                <span className="strength-label">{getPasswordStrengthLabel()}</span>
              </div>
            )}
          </div>

          <FormInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <button
          type="button"
          className="auth-link-btn"
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          Sign in instead
        </button>
      </div>

      <div className="auth-decoration" />
    </div>
  )
}

export default Register
