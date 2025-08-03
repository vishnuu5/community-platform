
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

function EditPostPage({ currentUser }) {
    const { id } = useParams()
    const navigate = useNavigate()

    const [postText, setPostText] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`${API_BASE_URL}/posts/${id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch post")
                }
                const data = await response.json()

                // Check if the current user is authorized to edit this post
                if (currentUser._id !== data.user && currentUser.role !== "admin") {
                    setError("You are not authorized to edit this post.")
                    setIsLoading(false)
                    return
                }

                setPostText(data.text)
            } catch (err) {
                console.error("Error fetching post:", err)
                setError(err.message || "Failed to load post for editing.")
            } finally {
                setIsLoading(false)
            }
        }

        if (currentUser) {
            fetchPost()
        }
    }, [id, currentUser, API_BASE_URL])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        if (!postText.trim()) {
            setError("Post text cannot be empty.")
            setIsSubmitting(false)
            return
        }

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: postText }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to update post")
            }

            setSuccess("Post updated successfully!")
            setTimeout(() => {
                navigate("/")
            }, 1500)
        } catch (err) {
            console.error("Error updating post:", err)
            setError(err.message || "Failed to update post.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <div className="text-center text-gray-600">Loading post for editing...</div>
    }

    if (error && !postText) {
        // Only show error if we couldn't load the post initially
        return <div className="text-center text-red-500">{error}</div>
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md px-4 sm:px-8">
            {" "}
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Post</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-600 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postText">
                        Post Content
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32 resize-y"
                        id="postText"
                        placeholder="What's on your mind?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditPostPage
