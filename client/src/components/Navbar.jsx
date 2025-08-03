
import { Link, useNavigate } from "react-router-dom"
import UserSearchInput from "./UserSearchInput"

function Navbar({ user, onLogout }) {
    const navigate = useNavigate()

    const handleSearch = (query) => {
        if (query.trim()) {
            navigate(`/search?query=${query}`) // Changed 'name' to 'query' for general search
        }
    }

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-700">
                    LinkedIn
                </Link>
                <div className="flex-grow mx-4 max-w-md">
                    <UserSearchInput onSearch={handleSearch} />
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/" className="text-gray-700 hover:text-blue-700 font-medium">
                                Home
                            </Link>
                            <Link to="/my-profile" className="text-gray-700 hover:text-blue-700 font-medium">
                                My Profile
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin-dashboard" className="text-gray-700 hover:text-blue-700 font-medium">
                                    Admin
                                </Link>
                            )}
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-700 font-medium">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
