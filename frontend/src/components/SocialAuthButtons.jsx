import { GoogleIcon, FacebookIcon } from './Icons.jsx'

export default function SocialAuthButtons({ onGoogleLogin, onFacebookLogin, submitting }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
      {/* Google Button */}
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={submitting}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.2s ease',
          opacity: submitting ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!submitting) {
            e.target.style.borderColor = '#d1d5db'
            e.target.style.backgroundColor = '#f9fafb'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!submitting) {
            e.target.style.borderColor = '#e5e7eb'
            e.target.style.backgroundColor = '#ffffff'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }
        }}
      >
        <GoogleIcon size={18} />
        <span>Google</span>
      </button>

      {/* Facebook Button */}
      <button
        type="button"
        onClick={onFacebookLogin}
        disabled={submitting}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.2s ease',
          opacity: submitting ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!submitting) {
            e.target.style.borderColor = '#d1d5db'
            e.target.style.backgroundColor = '#f9fafb'
            e.target.style.transform = 'translateY(-1px)'
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
        onMouseLeave={(e) => {
          if (!submitting) {
            e.target.style.borderColor = '#e5e7eb'
            e.target.style.backgroundColor = '#ffffff'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }
        }}
      >
        <FacebookIcon size={18} />
        <span>Facebook</span>
      </button>
    </div>
  )
}
