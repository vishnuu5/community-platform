
import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ProfileCard from "../components/ProfileCard"
import PostCard from "../components/PostCard"

function ProfilePage({ currentUser, userId }) {
    const { id } = useParams()
    const profileId = userId || id // Use userId prop if available (for "My Profile"), else use URL param
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingPosts, setLoadingPosts] = useState(true)
    const [profileError, setProfileError] = useState(null)
    const [postsError, setPostsError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

    const fetchProfileAndPosts = useCallback(async () => {
        if (!profileId) {
            setProfileError("No user ID provided.")
            setLoadingProfile(false)
            setLoadingPosts(false)
            return
        }

        setLoadingProfile(true)
        setLoadingPosts(true)
        setProfileError(null)
        setPostsError(null)

        try {
            // Fetch profile
            const profileResponse = await fetch(`${API_BASE_URL}/auth/users/${profileId}`)
            if (!profileResponse.ok) {
                throw new Error("Failed to fetch profile")
            }
            const profileData = await profileResponse.json()
            setProfile(profileData)

            // Fetch user posts
            const postsResponse = await fetch(`${API_BASE_URL}/posts/user/${profileId}`)
            if (!postsResponse.ok) {
                throw new Error("Failed to fetch user posts")
            }
            const postsData = await postsResponse.json()
            setPosts(postsData)
        } catch (error) {
            console.error("Error fetching profile or posts:", error)
            setProfileError("Failed to load profile or posts. User might not exist or server error.")
            setPostsError("Failed to load posts for this user.")
        } finally {
            setLoadingProfile(false)
            setLoadingPosts(false)
        }
    }, [profileId, API_BASE_URL])

    useEffect(() => {
        fetchProfileAndPosts()
    }, [fetchProfileAndPosts])

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

    if (loadingProfile || loadingPosts) {
        return <div className="text-center text-gray-600">Loading profile and posts...</div>
    }

    if (profileError) {
        return <div className="text-center text-red-500">{profileError}</div>
    }

    if (!profile) {
        return <div className="text-center text-gray-600">Profile not found.</div>
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            {" "}
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                {currentUser && currentUser._id === profile._id ? "My Profile" : `${profile.name}'s Profile`}
            </h1>
            <ProfileCard profile={profile} currentUser={currentUser} />
            <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-8">
                {currentUser && currentUser._id === profile._id ? "My Posts" : `${profile.name}'s Posts`}
            </h2>
            {postsError ? (
                <div className="text-center text-red-500">{postsError}</div>
            ) : posts.length === 0 ? (
                <div className="text-center text-gray-600">No posts found for this user.</div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} currentUser={currentUser} onDelete={handleDeletePost} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProfilePage
