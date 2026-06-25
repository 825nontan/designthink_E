import './ProductRankingSection.css'

interface RankingItem {
  emoji: string
  label: string
  count: number
}

interface ProductRankingSectionProps {
  ranking: RankingItem[]
}

export default function ProductRankingSection({ ranking }: ProductRankingSectionProps) {
  if (ranking.length === 0) {
    return null
  }

  return (
    <div className="product-ranking-section">
      <div className="product-ranking-header">
        <span className="product-ranking-icon">🏆</span>
        <h2 className="product-ranking-title">今日の人気商品ランキング</h2>
      </div>
      <div className="product-ranking-list">
        {ranking.map((item, index) => (
          <div key={item.label} className="product-ranking-item">
            <div className="rank-badge">{index + 1}</div>
            <div>
              <div className="product-ranking-name">{item.emoji} {item.label}</div>
              <div className="product-ranking-count">{item.count}件の話題</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
