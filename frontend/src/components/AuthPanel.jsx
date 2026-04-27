import AuthLogin from './AuthLogin.jsx'
import AuthSignup from './AuthSignup.jsx'

export default function AuthPanel({ open, mode, onClose, onModeChange, activeMode }) {
  const isLogin = mode === 'login'

  return (
    <>
      <div
        className={`authOverlay ${open ? 'authOverlayOpen' : ''}`}
        onClick={onClose}
        aria-hidden={open ? undefined : true}
      />

      <aside
        className={`authPanel ${open ? 'authPanelOpen' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Log in' : 'Sign up'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="authPanelHandle" aria-hidden="true" />

        <button type="button" className="authClose" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="authPanelBody">
          {/* Header - only show for login */}
          {isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              
              {/* Company Logo */}
              <img 
                src="/image/22.png" 
                alt="HaveIt"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />

              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1c1917' }}>
                  Welcome Back
                </h2>
                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
                  Sign in to continue to your account
                </p>
              </div>
            </div>
          )}

          {isLogin ? (
            <AuthLogin onSuccess={onClose} onOpenSignup={() => onModeChange('signup')} activeMode={activeMode} />
          ) : (
            <AuthSignup onSuccess={onClose} onOpenLogin={() => onModeChange('login')} activeMode={activeMode} />
          )}
        </div>
      </aside>
    </>
  )
}

