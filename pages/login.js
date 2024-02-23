import LoginForm from '@/Components/Login Form/LoginForm'
import React from 'react'

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="brand-name">BCIE CRM</h1>
        <LoginForm />
        
      </div>
    </div>
  )
}

export default Login