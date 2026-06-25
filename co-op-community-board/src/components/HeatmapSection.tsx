import { PostLocation } from '../types'
import './HeatmapSection.css'

interface HeatmapSectionProps {
  heatmap: Record<PostLocation, number>
}

export default function HeatmapSection({ heatmap }: HeatmapSectionProps) {
  // トップ3の場所を取得
  const sortedLocations = Object.entries(heatmap)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 3)

  if (sortedLocations.length === 0) {
    return null
  }

  const maxCount = Math.max(...sortedLocations.map(([_, count]) => count), 1)

  return (
    <div className="heatmap-section">
      <h2 className="heatmap-title">📍 混雑の話題</h2>
      <div className="heatmap-list">
        {sortedLocations.map(([location, count]) => (
          <div key={location} className="heatmap-item">
            <div className="heatmap-label">{location}</div>
            <div className="heatmap-bar-container">
              <div
                className="heatmap-bar"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                }}
              />
            </div>
            <div className="heatmap-count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
