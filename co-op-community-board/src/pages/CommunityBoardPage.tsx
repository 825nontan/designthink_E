import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { initializeAuth } from '../services/authService'
import { createPost, subscribeToPostsByStore, likePost } from '../services/postService'
import { Post, Store, PostLocation, TrendItem } from '../types'
import PostForm from '../components/PostForm'
import PostList from '../components/PostList'
import StatsCard from '../components/StatsCard'
import HeatmapSection from '../components/HeatmapSection'
import ProductRankingSection from '../components/ProductRankingSection'
import TrendSection from '../components/TrendSection'
import './CommunityBoardPage.css'

const storeNames: Record<Store, string> = {
  seikyo: '大学生協 購買',
  noma: 'noma',
  cafeteria: '食堂',
}

const DATA_STORE_ID: Store = 'seikyo'

const STORAGE_KEYS = {
  viewerCount: 'coopViewerCount',
  todayViews: 'coopTodayViews',
}

const getTodayKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
    .getDate()
    .toString()
    .padStart(2, '0')}`
}

const loadDailyCount = (key: string, fallback: number) => {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as { count: number; date: string }
    return parsed.date === getTodayKey() ? parsed.count : fallback
  } catch {
    return fallback
  }
}

const saveDailyCount = (key: string, count: number) => {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    key,
    JSON.stringify({ count, date: getTodayKey() })
  )
}

export default function CommunityBoardPage() {
  const { storeId } = useParams<{ storeId: Store }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(1)
  const [todayViews, setTodayViews] = useState(1)
  const [authReady, setAuthReady] = useState(false)

  const storeName = storeId ? storeNames[storeId as Store] || '生協' : '生協'

  useEffect(() => {
    setViewerCount(loadDailyCount(STORAGE_KEYS.viewerCount, 1))
    setTodayViews(loadDailyCount(STORAGE_KEYS.todayViews, 1))
  }, [])

  useEffect(() => {
    const initialize = async () => {
      await initializeAuth()
      setAuthReady(true)
    }

    initialize()
  }, [])

  // リアルタイムリスナー設定
  useEffect(() => {
    if (!authReady) return

    const unsubscribe = subscribeToPostsByStore(DATA_STORE_ID, (newPosts) => {
      setPosts(newPosts)

      // トレンド集計用に投稿内容を解析
      const emojiCounts = new Map<string, number>()
      newPosts.forEach((post) => {
        const emoji = post.emoji || '😊'
        emojiCounts.set(emoji, (emojiCounts.get(emoji) || 0) + 1)
      })
    })

    return unsubscribe
  }, [authReady])

  // 閲覧者数トラッキング（15秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const next = Math.min(prev + 1, 20)
        saveDailyCount(STORAGE_KEYS.viewerCount, next)
        return next
      })
      setTodayViews((prev) => {
        const next = Math.min(prev + 3, 200)
        saveDailyCount(STORAGE_KEYS.todayViews, next)
        return next
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const calculateTrends = (): TrendItem[] => {
    const emojiCounts = new Map<string, number>()
    const emojiMap: Record<string, string> = {
      '🥐': '🥐 パン',
      '🍱': '🍙 お弁当',
      '🍨': '🍨 アイス',
      '✏️': '✏️ 文房具',
      '🍜': '🍜 麺',
      '🧃': '🧃 飲み物',
    }

    posts.forEach((post) => {
      const emoji = post.emoji || '😊'
      const label = emojiMap[emoji] || emoji
      emojiCounts.set(label, (emojiCounts.get(label) || 0) + 1)
    })

    return Array.from(emojiCounts.entries())
      .map(([label, count]) => ({
        emoji: label.charAt(0),
        label: label.slice(2),
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const calculateHeatmap = () => {
    const heatmap: Record<string, number> = {
      '🥐 焼きたてパン': 0,
      '🍱 お弁当・おにぎり': 0,
      '🍜 インスタント麺・スープ': 0,
      '🍨 アイス': 0,
      '🍬 お菓子': 0,
      '📕 書籍': 0,
      '🧃 飲み物': 0,
      '✏️ 文房具': 0,
      '🛒 レジ': 0,
      '🍪 火・木限定チャンククッキー': 0,
      '✨ その他': 0,
    }

    posts.forEach((post) => {
      if (post.location && heatmap.hasOwnProperty(post.location)) {
        heatmap[post.location]++
      }
    })

    return heatmap
  }

  const calculateRanking = () => {
    const heatmap = calculateHeatmap()
    return Object.entries(heatmap)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => {
        const emoji = location.slice(0, location.indexOf(' '))
        const label = location.slice(location.indexOf(' ') + 1)
        return {
          emoji,
          label,
          count,
        }
      })
  }

  const handleSubmitPost = async (
    content: string,
    emoji: string,
    location?: PostLocation
  ) => {
    if (!authReady) {
      await initializeAuth()
      setAuthReady(true)
    }

    setIsLoading(true)
    try {
      await createPost(DATA_STORE_ID, content, emoji, location)
    } catch (error) {
      console.error('投稿失敗:', error)
      alert('投稿に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      await likePost(DATA_STORE_ID, postId)
    } catch (error) {
      console.error('いいね失敗:', error)
    }
  }

  return (
    <div className="community-board-page">
      <header className="page-header">
        <h1>生協 今どんな感じ！？</h1>
        <p className="page-subtitle">あなたの今でつながる生協</p>
        <p className="page-store">{storeName}</p>
      </header>

      <div className="page-content">
        <div className="stats-section">
          <StatsCard
            icon="👀"
            title="現在閲覧中"
            value={viewerCount}
            subtitle="人"
          />
          <StatsCard
            icon="🌸"
            title="今日の累計閲覧数"
            value={todayViews}
            subtitle="人"
          />
          <StatsCard
            icon="💬"
            title="今日の投稿"
            value={posts.length}
            subtitle="件"
          />
        </div>

        <HeatmapSection heatmap={calculateHeatmap()} />

        <ProductRankingSection ranking={calculateRanking()} />

        <TrendSection trends={calculateTrends()} />

        <PostForm onSubmit={handleSubmitPost} isLoading={isLoading} />

        <PostList posts={posts} onLike={handleLike} />

        <div className="site-footer">
          ※本イベントは「デザイン思考とロジックモデル」講義の一環として、学生が企画・実施するものです。<br />
          お問い合わせ：<br />
          共創工学部文化情報工学科　講師　土田修平<br />
          E-mail: tsuchida.shuhei@ocha.ac.jp
        </div>
      </div>
    </div>
  )
}
