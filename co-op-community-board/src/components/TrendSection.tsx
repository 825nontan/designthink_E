import { TrendItem } from '../types'
import './TrendSection.css'

interface TrendSectionProps {
  trends: TrendItem[]
}

export default function TrendSection({ trends }: TrendSectionProps) {
  if (trends.length === 0) {
    return null
  }

  const topTrends = trends.slice(0, 4)

  return (
    <div className="trend-section">
      <h2 className="trend-title">🌼 今日の生協トレンド</h2>
      <div className="trend-list">
        {topTrends.map((trend) => (
          <div key={trend.label} className="trend-item">
            <span className="trend-emoji">{trend.emoji}</span>
            <span className="trend-label">{trend.label}</span>
            <span className="trend-count">{trend.count}件</span>
          </div>
        ))}
      </div>
    </div>
  )
}
