
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, Link } from "react-router-dom"
import PostCard from "../components/PostCard"

function SearchPage({ currentUser }) {
    const [userSearchResults, setUserSearchResults] = useState([])
    const [postSearchResults, setPostSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get("query")

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const performSearch = useCallback(async () => {
        if (!searchQuery) {
            setUserSearchResults([])
            setPostSearchResults([])
            return
        }

        setLoading(true)
        setError(null)
        try {
            // Fetch user results
            const userResponse = await fetch(`${API_BASE_URL}/auth/users/search?name=${searchQuery}`)
            if (!userResponse.ok) {
                throw new Error("Failed to fetch user search results")
            }
            const userData = await userResponse.json()
            setUserSearchResults(userData)

            // Fetch post results
            const postResponse = await fetch(`${API_BASE_URL}/posts/search?query=${searchQuery}`)
            if (!postResponse.ok) {
                throw new Error("Failed to fetch post search results")
            }
            const postData = await postResponse.json()
            setPostSearchResults(postData)
        } catch (err) {
            console.error("Search error:", err)
            setError(err.message || "An error occurred during search.")
        } finally {
            setLoading(false)
        }
    }, [searchQuery, API_BASE_URL])

    useEffect(() => {
        performSearch()
    }, [performSearch])

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

            // Update post search results after deletion
            setPostSearchResults(postSearchResults.filter((post) => post._id !== postId))
        } catch (error) {
            console.error("Error deleting post:", error)
            alert(error.message || "Failed to delete post.")
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Search Results for "{searchQuery}"</h1>

            {loading ? (
                <div className="text-center text-gray-600">Searching...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Search Results */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Users</h2>
                        {userSearchResults.length === 0 ? (
                            <div className="text-center text-gray-600">No users found.</div>
                        ) : (
                            <div className="space-y-4">
                                {userSearchResults.map((user) => (
                                    <div key={user._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <Link to={`/profile/${user._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                                            {user.name}
                                        </Link>
                                        <p className="text-gray-600">{user.email}</p>
                                        <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Post Search Results */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Posts</h2>
                        {postSearchResults.length === 0 ? (
                            <div className="text-center text-gray-600">No posts found.</div>
                        ) : (
                            <div className="space-y-4">
                                {postSearchResults.map((post) => (
                                    <PostCard key={post._id} post={post} currentUser={currentUser} onDelete={handleDeletePost} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchPage
