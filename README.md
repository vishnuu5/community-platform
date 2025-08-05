# Mini LinkedIn Clone

This project is a simplified social media platform inspired by LinkedIn, allowing users to register, log in, create text-based posts, and view profiles of other users along with their posts. It also includes an admin panel and comprehensive search functionality.

## Features

- **User Authentication:**
  - Register with email and password.
  - Log in with email and password.
  - Secure password hashing using `bcryptjs`.
  - Session management using JSON Web Tokens (JWTs).
- **User Profiles:**
  - Users have a name, email, bio, and a `role` (user/admin).
  - View any user's profile page.
  - **Edit Profile:** Logged-in users can update their name and bio.
- **Public Post Feed:**
  - Create new text-only posts.
  - View a feed of all public posts, displaying the author's name and timestamp.
  - **Post Deletion:** Authors can delete their own posts; Admins can delete any post.
  - **Post Editing:** Authors can edit their own posts.
- **Profile Page:**
  - View a specific user's profile details.
  - See all posts made by that user.
- **Admin Panel:**
  - Dedicated dashboard for admin users.
  - View a list of all registered users.
  - View a list of all posts.
- **Search Functionality (Enhanced!):**
  - **User Search:** Search for users by name.
  - **Post Search:** Search for posts by their content.
  - Combined search results displayed on a dedicated search page.
- **Responsive Design:** Built with Tailwind CSS for a mobile-first and responsive user interface.
- **Error Handling:** Basic error messages for authentication and API interactions.
- **Loading States:** Visual feedback during data fetching.
- **Logout Functionality:** Users can securely log out of their accounts.

## Tech Stack

**Frontend:**

- **React.js:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web projects.
- **JavaScript:** The primary language for frontend logic.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **React Router DOM:** For client-side routing.

**Backend:**

- **Node.js:** A JavaScript runtime for server-side development.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB:** A NoSQL document database for storing user and post data.
- **Mongoose:** An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **bcryptjs:** For hashing and salting passwords.
- **jsonwebtoken:** For creating and verifying JWTs for authentication.
- **dotenv:** For loading environment variables from a `.env` file.
- **cors:** Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Setup Instructions

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/vishnuu5/community-platform.git
cd mini-linkedin-clone
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Variables:**

Create a `.env` file in the `backend` directory based on `.env.example`:

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

**Run the Backend Server:**

```bash
npm start
```

The backend server will run on `http://localhost:5000` (or the port you specified).

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Variables:**

Create a `.env` file in the `frontend` directory based on `.env.example`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

- Ensure `VITE_API_BASE_URL` points to your backend server's API endpoint. If deploying, this will be your deployed backend URL.

**Run the Frontend Development Server:**

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173` (or another available port).

## Admin/Demo User Logins

You can register a new user through the application's registration page. Once registered, you can use those credentials to log in.

**To create an Admin User:**
Currently, the `role` is set to `user` by default. To create an admin user, you would need to manually update a user's `role` field in your MongoDB database to `'admin'` after they register. For example, using MongoDB Compass or `mongosh`:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

**Example Credentials (after registration):**

- **Regular User Email:** `user@example.com`
- **Regular User Password:** `password123`
- **Admin User Email:** `admin@example.com` (after manual role update in DB)
- **Admin User Password:** `adminpassword` (or whatever you registered with)

## Extra Features (Optional)

- **Basic Responsiveness:** The UI is designed to be responsive using Tailwind CSS, adapting to different screen sizes.
- **User Feedback:** Simple success/error messages are displayed for actions like registration, login, and post creation.
- **Loading Indicators:** Visual cues are provided when data is being fetched.
- **Logout Functionality:** Users can securely log out of their accounts.
- **Admin Dashboard:** A dedicated page for administrators to manage users and posts.
- **Profile Editing:** Users can update their name and bio.
- **Post Editing:** Users can edit their own posts.

---

**GitHub Repo Link:**
 [Click-here](https://github.com/vishnuu5/community-platform.git)


**Live Demo URL:**
 [Click-demo](https://community-platform-vert.vercel.app)
