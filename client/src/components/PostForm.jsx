
import { useState } from "react"

function PostForm({ onCreatePost, isLoading, error }) {
    const [postText, setPostText] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (postText.trim()) {
            onCreatePost(postText)
            setPostText("") // Clear the input after submission
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a New Post</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[80px]"
                    placeholder="What's on your mind?"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    required
                ></textarea>
                <button
                    type="submit"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? "Posting..." : "Post"}
                </button>
            </form>
        </div>
    )
}

export default PostForm
