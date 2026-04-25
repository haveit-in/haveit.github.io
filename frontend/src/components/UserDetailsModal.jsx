import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  XIcon, 
  SaveIcon, 
  TrashIcon, 
  PlusIcon,
  CameraIcon,
  CalendarIcon,
  BriefcaseIcon,
  GlobeIcon
} from './Icons.jsx'

const UserDetailsModal = ({ onClose, activeMode }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [saveStatus, setSaveStatus] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState('')
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth || '',
    
    // Professional Info
    jobTitle: user?.jobTitle || '',
    company: user?.company || '',
    website: user?.website || '',
    
    // Social Info
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    github: user?.github || '',
    
    // Preferences
    notifications: user?.notifications !== false,
    publicProfile: user?.publicProfile || false,
    language: user?.language || 'en'
  })

  const accent = activeMode === 'food'
    ? { 
        bg: 'bg-orange-500', 
        bgLight: 'bg-orange-50', 
        text: 'text-orange-500', 
        border: 'border-orange-200', 
        hover: 'hover:bg-orange-600',
        gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
      }
    : { 
        bg: 'bg-green-600', 
        bgLight: 'bg-green-50', 
        text: 'text-green-600', 
        border: 'border-green-200', 
        hover: 'hover:bg-green-700',
        gradient: 'bg-gradient-to-br from-green-600 to-green-700'
      }

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || '',
        jobTitle: user.jobTitle || '',
        company: user.company || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        github: user.github || '',
        notifications: user.notifications !== false,
        publicProfile: user.publicProfile || false,
        language: user.language || 'en'
      })
    }
  }, [user])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm('')
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose, showDeleteConfirm])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    try {
      setSaveStatus('Saving...')
      // TODO: Add API call to update user profile
      // await updateUserProfile(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSaveStatus('Saved successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('Error saving profile')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleCancel = () => {
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || '',
        jobTitle: user.jobTitle || '',
        company: user.company || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        github: user.github || '',
        notifications: user.notifications !== false,
        publicProfile: user.publicProfile || false,
        language: user.language || 'en'
      })
    }
    setIsEditing(false)
  }

  const handleDeleteField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }))
    setSaveStatus(`${field} deleted successfully!`)
    setTimeout(() => setSaveStatus(''), 2000)
  }

  const handleAddField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }))
    setIsEditing(true)
    setActiveTab(field.includes('linkedin') || field.includes('twitter') || field.includes('github') ? 'social' : 
               field.includes('jobTitle') || field.includes('company') || field.includes('website') ? 'professional' : 'basic')
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: UserIcon },
    { id: 'professional', label: 'Professional', icon: BriefcaseIcon },
    { id: 'social', label: 'Social', icon: GlobeIcon },
    { id: 'preferences', label: 'Preferences', icon: UserIcon }
  ]

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <UserIcon size={16} className="mr-2 text-gray-400" />
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.name || 'Not set'}</span>
              {formData.name && (
                <button
                  onClick={() => handleDeleteField('name')}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <MailIcon size={16} className="mr-2 text-gray-400" />
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.email || 'Not set'}</span>
              {formData.email && (
                <button
                  onClick={() => handleDeleteField('email')}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <PhoneIcon size={16} className="mr-2 text-gray-400" />
            Phone Number
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.phone || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.phone && (
                  <button
                    onClick={() => handleAddField('phone')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.phone && (
                  <button
                    onClick={() => handleDeleteField('phone')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <CalendarIcon size={16} className="mr-2 text-gray-400" />
            Date of Birth
          </label>
          {isEditing ? (
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.dateOfBirth || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.dateOfBirth && (
                  <button
                    onClick={() => handleAddField('dateOfBirth')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.dateOfBirth && (
                  <button
                    onClick={() => handleDeleteField('dateOfBirth')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <MapPinIcon size={16} className="mr-2 text-gray-400" />
          Address
        </label>
        {isEditing ? (
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Enter your address"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[80px] flex items-start justify-between">
            <span className="flex-1">{formData.address || 'Not set'}</span>
            <div className="flex items-center gap-2 ml-2">
              {!formData.address && (
                <button
                  onClick={() => handleAddField('address')}
                  className="text-green-500 hover:text-green-700 p-1"
                >
                  <PlusIcon size={16} />
                </button>
              )}
              {formData.address && (
                <button
                  onClick={() => handleDeleteField('address')}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <UserIcon size={16} className="mr-2 text-gray-400" />
          Bio
        </label>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Tell us about yourself"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[100px] flex items-start justify-between">
            <span className="flex-1">{formData.bio || 'Not set'}</span>
            <div className="flex items-center gap-2 ml-2">
              {!formData.bio && (
                <button
                  onClick={() => handleAddField('bio')}
                  className="text-green-500 hover:text-green-700 p-1"
                >
                  <PlusIcon size={16} />
                </button>
              )}
              {formData.bio && (
                <button
                  onClick={() => handleDeleteField('bio')}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <BriefcaseIcon size={16} className="mr-2 text-gray-400" />
            Job Title
          </label>
          {isEditing ? (
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your job title"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.jobTitle || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.jobTitle && (
                  <button
                    onClick={() => handleAddField('jobTitle')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.jobTitle && (
                  <button
                    onClick={() => handleDeleteField('jobTitle')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <BriefcaseIcon size={16} className="mr-2 text-gray-400" />
            Company
          </label>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your company"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.company || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.company && (
                  <button
                    onClick={() => handleAddField('company')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.company && (
                  <button
                    onClick={() => handleDeleteField('company')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
          <GlobeIcon size={16} className="mr-2 text-gray-400" />
          Website
        </label>
        {isEditing ? (
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://yourwebsite.com"
          />
        ) : (
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
            <span>{formData.website || 'Not set'}</span>
            <div className="flex items-center gap-2">
              {!formData.website && (
                <button
                  onClick={() => handleAddField('website')}
                  className="text-green-500 hover:text-green-700 p-1"
                >
                  <PlusIcon size={16} />
                </button>
              )}
              {formData.website && (
                <button
                  onClick={() => handleDeleteField('website')}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <TrashIcon size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderSocialInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <GlobeIcon size={16} className="mr-2 text-gray-400" />
            LinkedIn
          </label>
          {isEditing ? (
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="linkedin.com/in/yourprofile"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.linkedin || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.linkedin && (
                  <button
                    onClick={() => handleAddField('linkedin')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.linkedin && (
                  <button
                    onClick={() => handleDeleteField('linkedin')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <GlobeIcon size={16} className="mr-2 text-gray-400" />
            Twitter
          </label>
          {isEditing ? (
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="@yourusername"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.twitter || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.twitter && (
                  <button
                    onClick={() => handleAddField('twitter')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.twitter && (
                  <button
                    onClick={() => handleDeleteField('twitter')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <GlobeIcon size={16} className="mr-2 text-gray-400" />
            GitHub
          </label>
          {isEditing ? (
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="github.com/yourusername"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center justify-between">
              <span>{formData.github || 'Not set'}</span>
              <div className="flex items-center gap-2">
                {!formData.github && (
                  <button
                    onClick={() => handleAddField('github')}
                    className="text-green-500 hover:text-green-700 p-1"
                  >
                    <PlusIcon size={16} />
                  </button>
                )}
                {formData.github && (
                  <button
                    onClick={() => handleDeleteField('github')}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <TrashIcon size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderPreferences = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive email updates about your account</p>
          </div>
          {isEditing ? (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          ) : (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.notifications ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {formData.notifications ? 'Enabled' : 'Disabled'}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Public Profile</p>
            <p className="text-sm text-gray-500">Make your profile visible to other users</p>
          </div>
          {isEditing ? (
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="publicProfile"
                checked={formData.publicProfile}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          ) : (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.publicProfile ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
            }`}>
              {formData.publicProfile ? 'Public' : 'Private'}
            </div>
          )}
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <GlobeIcon size={16} className="mr-2 text-gray-400" />
            Language
          </label>
          {isEditing ? (
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[48px] flex items-center">
              {formData.language === 'en' ? 'English' : 
               formData.language === 'es' ? 'Spanish' : 
               formData.language === 'fr' ? 'French' : 
               formData.language === 'de' ? 'German' : 
               formData.language === 'zh' ? 'Chinese' : 'English'}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo()
      case 'professional':
        return renderProfessionalInfo()
      case 'social':
        return renderSocialInfo()
      case 'preferences':
        return renderPreferences()
      default:
        return renderBasicInfo()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative ${accent.gradient} px-8 pt-8 pb-12 flex-shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/20"
          >
            <XIcon size={20} />
          </button>
          
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                {user?.photo_url ? (
                  <img 
                    src={user.photo_url} 
                    alt={user.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={48} className="text-white" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <CameraIcon size={16} />
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {formData.name || 'Your Name'}
            </h2>
            <p className="text-white/80 text-sm">
              {formData.email || 'your.email@example.com'}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 -mt-6">
          {/* White card for form fields */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 sticky top-0 bg-white z-10 pb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? `${accent.text} border-current`
                        : 'text-gray-500 border-transparent hover:text-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] pb-4">
              {renderTabContent()}
            </div>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center animate-in slide-in-from-top duration-200 ${
              saveStatus.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 
              saveStatus.includes('Saving') ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
              'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {saveStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 pb-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className={`flex-1 ${accent.bg} ${accent.hover} text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg`}
                >
                  <SaveIcon size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 ${accent.bg} ${accent.hover} text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2`}
                >
                  <SaveIcon size={18} />
                  Edit Information
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
