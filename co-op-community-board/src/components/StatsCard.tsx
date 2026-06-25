import './StatsCard.css'

interface StatsCardProps {
  icon: string
  title: string
  value: number | string
  subtitle?: string
}

export default function StatsCard({ icon, title, value, subtitle }: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <div className="stats-title">{title}</div>
        <div className="stats-value">{value}</div>
        {subtitle && <div className="stats-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}
