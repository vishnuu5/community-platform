import { Link } from "react-router-dom"

function ProfileCard({ profile, currentUser }) {
    if (!profile) {
        return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">Loading profile...</div>
    }

    const isCurrentUserProfile = currentUser && currentUser._id === profile._id

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 relative">
            {isCurrentUserProfile && (
                <Link
                    to="/edit-profile"
                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-md"
                >
                    Edit Profile
                </Link>
            )}
            <div className="flex items-center mb-4">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-4xl font-bold text-blue-700 mr-4">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-md text-gray-600">{profile.email}</p>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio || "No bio provided yet."}</p>
            </div>
        </div>
    )
}

export default ProfileCard
