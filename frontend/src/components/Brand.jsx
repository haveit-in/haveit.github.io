import { Link } from 'react-router-dom'
import bagLogoUrl from '../../../image/bag logo.png'

export default function Brand({ to = '/', label = 'HaveIt home', activeMode = 'food' }) {
  return (
    <Link to={to} className="brand" aria-label={label}>
      <span className="logoSquare" aria-hidden="true">
        <img className="logoImg" src={bagLogoUrl} alt="" />
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

