import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5000'

function CreateEntry() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    apartmentName: '',
    vehicleType: '',
    vehicleNumber: '',
    purposeOfVisit: '',
    durationOfVisit: '',
    dateOfVisit: '',
    timeOfVisit: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const requiredFields = Object.keys(formData)
    const emptyFields = requiredFields.filter(field => !formData[field].trim())
    
    if (emptyFields.length > 0) {
      setError('Please fill in all fields')
      return
    }

    try {
      const response = await axios.post('/api/entries', formData)
      navigate('/')
    } catch (error) {
      setError('Failed to create entry. Please try again.')
      console.error('Error creating entry:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Visitor Entry</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label htmlFor="apartmentName" className="block text-sm font-medium text-gray-700 mb-2">
            Apartment Name
          </label>
          <input
            type="text"
            id="apartmentName"
            name="apartmentName"
            value={formData.apartmentName}
            onChange={handleChange}
            className="input"
            placeholder="Enter apartment name"
          />
        </div>

        <div>
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <input
            type="text"
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="input"
            placeholder="Enter vehicle type"
          />
        </div>

        <div>
          <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="input"
            placeholder="Enter vehicle number"
          />
        </div>

        <div>
          <label htmlFor="purposeOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Visit
          </label>
          <textarea
            id="purposeOfVisit"
            name="purposeOfVisit"
            value={formData.purposeOfVisit}
            onChange={handleChange}
            className="input"
            placeholder="Enter purpose of visit"
            rows="3"
          />
        </div>

        <div>
          <label htmlFor="durationOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
            Duration of Visit
          </label>
          <input
            type="text"
            id="durationOfVisit"
            name="durationOfVisit"
            value={formData.durationOfVisit}
            onChange={handleChange}
            className="input"
            placeholder="Enter duration (e.g., 2 hours)"
          />
        </div>

        <div>
          <label htmlFor="dateOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Visit
          </label>
          <input
            type="date"
            id="dateOfVisit"
            name="dateOfVisit"
            value={formData.dateOfVisit}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="timeOfVisit" className="block text-sm font-medium text-gray-700 mb-2">
            Time of Visit
          </label>
          <input
            type="time"
            id="timeOfVisit"
            name="timeOfVisit"
            value={formData.timeOfVisit}
            onChange={handleChange}
            className="input"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Create Entry
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateEntry 