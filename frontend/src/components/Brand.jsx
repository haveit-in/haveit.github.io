import { Link } from 'react-router-dom'

export default function Brand({ to = '/', label = 'HaveIt home', activeMode = 'food' }) {
  return (
    <Link to={to} className="brand" aria-label={label}>
      <span className="logoSquare" aria-hidden="true">
        <img className="logoImg" src="/image/bag logo.png" alt="" />
      </span>
      <span 
        className="brandText" 
        style={{ color: activeMode === 'food' ? '#f97316' : '#22c55e' }}
      >
        Haveit
      </span>
    </Link>
  )
}

