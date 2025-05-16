import { useNavigate } from "react-router-dom"

export const AuthPageHeader = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-purple-700">NeighbourConnect</h1>
        <button 
          className="flex items-center gap-2 pl-3 pr-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md transition-colors"
          onClick={() => navigate(-1)}
        >
          <svg 
              className="h-5 w-5 mr-4 text-color-white"
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#ffffff" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 16l-6-6 6-6"/><path d="M20 21v-7a4 4 0 0 0-4-4H5"/></svg>
          <span>Back</span>
        </button>
      </div>
    </div>
  )
}