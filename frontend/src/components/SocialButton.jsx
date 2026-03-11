export default function SocialButton({ provider, icon, onClick }) {
  return (
    <button type="button" className="btn" onClick={onClick}>
      {icon}
      <span>Continue with {provider}</span>
    </button>
  )
}

