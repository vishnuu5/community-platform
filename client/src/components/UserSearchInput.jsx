
import { useState } from "react"

function UserSearchInput({ onSearch }) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center w-full">
            {" "}
            <input
                type="text"
                placeholder="Search users or posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0" // Added flex-grow and min-w-0
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md whitespace-nowrap"
            >
                {" "}
                Search
            </button>
        </form>
    )
}

export default UserSearchInput
