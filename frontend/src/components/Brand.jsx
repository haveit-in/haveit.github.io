import { Link } from 'react-router-dom'
import logoUrl from '../../../image/company_logo .png'

export default function Brand({ to = '/', label = 'HaveIt home' }) {
  return (
    <Link to={to} className="brand" aria-label={label}>
      <img className="brandLogo" src={logoUrl} alt="HaveIt" />
      <span className="srOnly">HaveIt</span>
    </Link>
  )
}

