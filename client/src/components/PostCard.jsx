
import { Link } from "react-router-dom"

function PostCard({ post, currentUser, onDelete }) {
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    const isAuthor = currentUser && currentUser._id === post.user
    const isAdmin = currentUser && currentUser.role === "admin"
    const canDelete = isAuthor || isAdmin
    const canEdit = isAuthor // Only author can edit

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-4 relative">
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-600 mr-3">
                    {post.authorName ? post.authorName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                    <Link to={`/profile/${post.user}`} className="font-semibold text-gray-800 hover:underline">
                        {post.authorName || "Unknown User"}
                    </Link>
                    <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{post.text}</p>
            <div className="absolute top-4 right-4 flex space-x-2">
                {canEdit && (
                    <Link
                        to={`/edit-post/${post._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-md"
                        aria-label={`Edit post by ${post.authorName}`}
                    >
                        Edit
                    </Link>
                )}
                {canDelete && (
                    <button
                        onClick={() => onDelete(post._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md"
                        aria-label={`Delete post by ${post.authorName}`}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    )
}

export default PostCard
