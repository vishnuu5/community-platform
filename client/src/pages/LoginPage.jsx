
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthForm from "../components/AuthForm"

function LoginPage({ onLogin }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const handleLoginSubmit = async ({ email, password }) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Login failed")
            }

            onLogin({ _id: data._id, name: data.name, email: data.email, bio: data.bio, role: data.role }, data.token)
            navigate("/")
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
            {" "}
            <AuthForm type="login" onSubmit={handleLoginSubmit} isLoading={isLoading} error={error} />
        </div>
    )
}

export default LoginPage
