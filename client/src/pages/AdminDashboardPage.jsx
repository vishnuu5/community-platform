
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"

function AdminDashboardPage({ currentUser }) {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [usersError, setUsersError] = useState(null)
    const [postsError, setPostsError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true)
        setUsersError(null)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch users")
            }
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error("Error fetching users:", error)
            setUsersError("Failed to load users. " + error.message)
        } finally {
            setLoadingUsers(false)
        }
    }, [API_BASE_URL])

    const fetchPosts = useCallback(async () => {
        setLoadingPosts(true)
        setPostsError(null)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/admin/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch posts")
            }
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            console.error("Error fetching posts:", error)
            setPostsError("Failed to load posts. " + error.message)
        } finally {
            setLoadingPosts(false)
        }
    }, [API_BASE_URL])

    useEffect(() => {
        if (currentUser && currentUser.role === "admin") {
            fetchUsers()
            fetchPosts()
        }
    }, [currentUser, fetchUsers, fetchPosts])

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post? This action is irreversible.")) {
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

    if (!currentUser || currentUser.role !== "admin") {
        return <div className="text-center text-red-500">Access Denied. You must be an admin to view this page.</div>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0">
            {" "}
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* All Users Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">All Users</h2>
                    {loadingUsers ? (
                        <div className="text-center text-gray-600">Loading users...</div>
                    ) : usersError ? (
                        <div className="text-center text-red-500">{usersError}</div>
                    ) : users.length === 0 ? (
                        <div className="text-center text-gray-600">No users found.</div>
                    ) : (
                        <ul className="space-y-2">
                            {users.map((userItem) => (
                                <li key={userItem._id} className="border-b border-gray-200 pb-2">
                                    <Link to={`/profile/${userItem._id}`} className="font-semibold text-blue-600 hover:underline">
                                        {userItem.name} ({userItem.email}) - {userItem.role}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* All Posts Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">All Posts</h2>
                    {loadingPosts ? (
                        <div className="text-center text-gray-600">Loading posts...</div>
                    ) : postsError ? (
                        <div className="text-center text-red-500">{postsError}</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center text-gray-600">No posts found.</div>
                    ) : (
                        <ul className="space-y-4">
                            {posts.map((post) => (
                                <li key={post._id} className="border-b border-gray-200 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-700 leading-relaxed mb-1">{post.text}</p>
                                            <p className="text-sm text-gray-500">
                                                By{" "}
                                                <Link to={`/profile/${post.user}`} className="font-medium hover:underline">
                                                    {post.authorName}
                                                </Link>{" "}
                                                on {new Date(post.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md ml-4"
                                            aria-label={`Delete post by ${post.authorName}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage
