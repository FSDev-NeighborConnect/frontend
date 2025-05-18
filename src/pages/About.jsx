import { useNavigate } from "react-router-dom"

const AboutPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">About Us</h1>
          <button
            className="flex items-center gap-2 pl-3 pr-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition-colors"
            onClick={() => navigate("/")}
          >
            <svg
              className="h-5 w-5 mr-4 text-color-white"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 16l-6-6 6-6" />
              <path d="M20 21v-7a4 4 0 0 0-4-4H5" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            NeighbourConnect
          </h2>


          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Elias Daoud
            </h3>
            <div className="text-gray-700 space-y-4">
              <p className="font-medium">Focus Area: Backend Architecture and System Integration</p>
              
              <p className="font-medium">Key Contributions:</p>
              
              <div className="ml-4">
                <p className="font-medium mb-1">Backend Architecture</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Helped design and implement the backend using Node.js, Express.js and MVC structure</li>
                  <li>Built secure authentication and authorization with JWT and CSRF protection</li>
                  <li>Developed complete CRUD routes for users, posts, comments and admin tools</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Security & Middleware</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Integrated HTTP-only cookies, custom middleware</li>
                  <li>Patched CORS issues and hardened route protection logic</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Infrastructure & Testing</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Configured MongoDB Atlas, Render deployment and Cloudinary for image handling</li>
                  <li>Wrote extensive unit and integration tests using Jest and Supertest</li>
                  <li>Documented backend API with OpenAPI and maintained project setup resources</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Team Integration & Coordination</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Assumed responsibility for backend coordination and integration during critical stages</li>
                  <li>Managed backend repo, merged and stabilized PRs</li>
                  <li>Resolved integration blockers and collaborated closely with frontend</li>
                </ul>
              </div>
            </div>
          </div>


          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Max Dahlberg
            </h3>
            <div className="text-gray-700 space-y-4">
              <p className="font-medium">Focus Area: Admin Dashboard & Authentication Pages</p>
              
              <p className="font-medium">Key Contributions:</p>
              
              <div className="ml-4">
                <p className="font-medium mb-1">Admin Dashboard Development</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Implemented full CRUD functionality for users, posts, events, and comments</li>
                  <li>Added postal code sorting across all admin dashboard features</li>
                  <li>Developed a statistics page showing metrics for users, posts, events, and comments organized by postal code</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Authentication System</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Built login and register pages with robust input validation</li>
                  <li>Implemented secure storage of CSRF token and user ID in React Context</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Tailwind CSS and chat integration</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Converted main page from CSS to Tailwind CSS</li>
                  <li>Integrated and enhanced chat feature with Tailwind CSS styling</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Deployment & Integration</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Implemented frontend deployment using Netlify</li>
                  <li>Ensured compatibility across both development and production environments</li>
                  <li>Tested and debugged API endpoints as new routes were added</li>
                  <li>Provided solutions and fixes for encountered bugs throughout development</li>
                </ul>
              </div>
            </div>
          </div>


          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Meenu Gupta
            </h3>
            <p className="text-gray-700"></p>
          </div>


          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Muhammad Hamza Jamil
            </h3>
            <p className="text-gray-700"></p>
          </div>


          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Rim Aboubakar
            </h3>
            <div className="text-gray-700 space-y-4">
              <p className="font-medium">Focus Area: User Profile & Engagement Features</p>
              
              <p className="font-medium">Key Contributions:</p>
              
              <div className="ml-4">
                <p className="font-medium mb-1">User Profile System</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Designed and implemented the complete user profile interface</li>
                  <li>Developed profile viewing for both current users and neighbors</li>
                  <li>Integrated postal code-based neighbor discovery</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Profile Customization</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Created edit profile functionality for updating user details (bio, hobbies, contact info)</li>
                  <li>Implemented dual image upload (avatar + cover photo) with preview functionality</li>
                  <li>Added responsive design for optimal viewing across devices</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Community Engagement Features</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Built post/event display system with sorting by recency</li>
                  <li>Developed the "Like" interaction system for posts and events</li>
                  <li>Implemented creation flows for both posts and community events</li>
                </ul>
              </div>

              <div className="ml-4">
                <p className="font-medium mb-1">Technical Implementation</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Integrated frontend components with backend APIs</li>
                  <li>Configured secure image uploads to cloud storage</li>
                  <li>Optimized data fetching for neighbor listings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage