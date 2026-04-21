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
}) {
  return (
    <div className="field">
      <div className="labelRow">
        <label className="label" htmlFor={id}>
          {label}
        </label>
        {right}
      </div>
      <input
        id={id}
        className="input"
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error) || undefined}
        style={{
          borderColor: activeMode === 'food' ? '#f97316' : '#22c55e',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = activeMode === 'food' ? '#f97316' : '#22c55e'
          e.target.style.backgroundColor = activeMode === 'food' ? '#fff7ed' : '#f0fdf4'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e5e7eb'
          e.target.style.backgroundColor = '#ffffff'
        }}
      />
      {error ? <div className="error">{error}</div> : null}
    </div>
  )
}

