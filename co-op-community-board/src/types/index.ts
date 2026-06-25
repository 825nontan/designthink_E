export type Store = 'seikyo' | 'noma' | 'cafeteria'

export interface Post {
  id: string
  storeId: Store
  content: string
  emoji?: string
  location?: PostLocation
  likes: number
  createdAt: Date
  uid?: string
}

export type PostLocation =
  | '🥐 焼きたてパン'
  | '🍱 お弁当・おにぎり'
  | '🍜 インスタント麺・スープ'
  | '🍨 アイス'
  | '🍬 お菓子'
  | '📕 書籍'
  | '🧃 飲み物'
  | '✏️ 文房具'
  | '🛒 レジ'
  | '🍪 火・木限定チャンククッキー'
  | '✨ その他'

export interface StoreStats {
  storeId: Store
  storeName: string
  viewerCount: number
  todayUserCount: number
  postCount: number
  heatmap: Record<PostLocation, number>
  trends: TrendItem[]
}

export interface TrendItem {
  emoji: string
  label: string
  count: number
}
