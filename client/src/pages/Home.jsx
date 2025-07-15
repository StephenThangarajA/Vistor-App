import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000'

function Home() {
  const [visitors, setVisitors] = useState([])
  const [filteredVisitors, setFilteredVisitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get('/api/entries')
        setVisitors(response.data.data)
        setFilteredVisitors(response.data.data)
      } catch (error) {
        console.error('Error fetching visitors:', error)
        setError('Failed to load visitors')
      } finally {
        setLoading(false)
      }
    }

    fetchVisitors()
  }, [])

  useEffect(() => {
    const searchResults = visitors.filter(visitor => {
      const searchString = searchTerm.toLowerCase()
      return (
        visitor.username.toLowerCase().includes(searchString) ||
        visitor.apartmentName.toLowerCase().includes(searchString) ||
        visitor.vehicleType.toLowerCase().includes(searchString) ||
        visitor.vehicleNumber.toLowerCase().includes(searchString) ||
        visitor.purposeOfVisit.toLowerCase().includes(searchString) ||
        visitor.durationOfVisit.toLowerCase().includes(searchString) ||
        new Date(visitor.dateOfVisit).toLocaleDateString().includes(searchString) ||
        visitor.timeOfVisit.includes(searchString)
      )
    })
    setFilteredVisitors(searchResults)
  }, [searchTerm, visitors])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Visitor Entries</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Entry
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredVisitors.length} results
          </p>
        )}
      </div>
      
      <div className="grid gap-6">
        {filteredVisitors.map((visitor) => (
          <div
            key={visitor.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">{visitor.username}</h2>
                <p className="text-gray-600">Apartment: {visitor.apartmentName}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Vehicle: {visitor.vehicleType}</p>
                <p className="text-gray-600">Vehicle Number: {visitor.vehicleNumber}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Purpose: {visitor.purposeOfVisit}</p>
                <p className="text-gray-600">Duration: {visitor.durationOfVisit}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>Date: {new Date(visitor.dateOfVisit).toLocaleDateString()}</p>
                <p>Time: {visitor.timeOfVisit}</p>
                <p>Created: {new Date(visitor.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredVisitors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No matching entries found.' : 'No visitor entries found. Create a new entry to get started.'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home 