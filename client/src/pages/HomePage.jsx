
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import PostForm from "../components/PostForm"
import PostCard from "../components/PostCard"

function HomePage({ user }) {
    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [postError, setPostError] = useState(null)
    const [createPostLoading, setCreatePostLoading] = useState(false)
    const [createPostError, setCreatePostError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const fetchPosts = useCallback(async () => {
        setLoadingPosts(true)
        setPostError(null)
        try {
            const response = await fetch(`${API_BASE_URL}/posts`)
            if (!response.ok) {
                throw new Error("Failed to fetch posts")
            }
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            console.error("Error fetching posts:", error)
            setPostError("Failed to load posts. Please try again later.")
        } finally {
            setLoadingPosts(false)
        }
    }, [API_BASE_URL])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const handleCreatePost = async (text) => {
        setCreatePostLoading(true)
        setCreatePostError(null)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to create post")
            }

            const newPost = await response.json()
            setPosts([newPost, ...posts]) // Add new post to the top
        } catch (error) {
            console.error("Error creating post:", error)
            setCreatePostError(error.message || "Failed to create post.")
        } finally {
            setCreatePostLoading(false)
        }
    }

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return
        }
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to delete post")
            }

            setPosts(posts.filter((post) => post._id !== postId))
        } catch (error) {
            console.error("Error deleting post:", error)
            alert(error.message || "Failed to delete post.")
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Home Feed</h1>

            {user ? (
                <PostForm onCreatePost={handleCreatePost} isLoading={createPostLoading} error={createPostError} />
            ) : (
                <p className="text-center text-gray-600 mb-6">
                    Please{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        log in
                    </Link>{" "}
                    or{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        register
                    </Link>{" "}
                    to create posts.
                </p>
            )}

            {loadingPosts ? (
                <div className="text-center text-gray-600">Loading posts...</div>
            ) : postError ? (
                <div className="text-center text-red-500">{postError}</div>
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-600">No posts yet. Be the first to post!</div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={user} onDelete={handleDeletePost} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default HomePage
