import { Ban } from 'lucide-react'

export default function TextField({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  right,
  error,
  inputMode,
  activeMode = 'food',
  disabled,
}) {
  return (
    <div className="field">
      <div className="labelRow">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        {right}
      </div>
      <div 
        style={{ position: 'relative' }}
        onMouseEnter={(e) => {
          if (disabled) {
            const icon = e.currentTarget.querySelector('.disabled-icon-overlay')
            if (icon) icon.style.opacity = '1'
          }
        }}
        onMouseLeave={(e) => {
          if (disabled) {
            const icon = e.currentTarget.querySelector('.disabled-icon-overlay')
            if (icon) icon.style.opacity = '0'
          }
        }}
      >
        <input
          id={id}
          className="input"
          type={type}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          style={{
            border: '1px solid #e5e7eb',
            outline: 'none',
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.borderColor = activeMode === 'food' ? '#f97316' : '#22c55e'
              e.target.style.boxShadow = activeMode === 'food' ? '0 0 0 2px rgba(249,115,22,0.2)' : '0 0 0 2px rgba(34,197,94,0.2)'
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb'
            e.target.style.boxShadow = 'none'
          }}
        />
        {disabled && (
          <div 
            className="disabled-icon-overlay"
            style={{
              position: 'absolute',
              top: '50%',
              right: '12px',
              transform: 'translateY(-50%)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ban size={16} color="#6b7280" />
          </div>
        )}
      </div>
      {error ? <div className="error">{error}</div> : null}
    </div>
  )
}

