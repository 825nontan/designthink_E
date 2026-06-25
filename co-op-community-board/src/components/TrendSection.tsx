import './TrendSection.css'

interface TrendSectionProps {
  hotLocations?: { emoji: string; label: string; count: number }[]
  feelings?: { emoji: string; count: number }[]
}


export default function TrendSection({ hotLocations, feelings }: TrendSectionProps) {
  const hot = hotLocations || []
  const feels = feelings || []

  return (
    <div className="trend-section">
      {hot.length > 0 && (
        <>
          <h2 className="trend-title">📍 本日HOTな場所</h2>
          <div className="trend-list trend-grid">
            {hot.map((item, idx) => (
              <div key={`${item.label}-${idx}`} className="trend-item compact">
                <span className="trend-emoji">{item.emoji}</span>
                <span className="trend-label">{item.label}</span>
                <span className="trend-count">{item.count}件</span>
              </div>
            ))}
          </div>
        </>
      )}

      {feels.length > 0 && (
        <>
          <h2 className="trend-title">💝 みんなのきもち</h2>
          <div className="trend-list trend-grid">
            {feels.map((f, idx) => (
              <div key={`${f.emoji}-${idx}`} className="trend-item compact">
                <span className="trend-emoji">{f.emoji}</span>
                <span className="trend-count">{f.count}件</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
