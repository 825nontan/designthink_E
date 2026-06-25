import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { initializeAuth } from '../services/authService'
import { createPost, subscribeToPostsByStore } from '../services/postService'
import {
  registerViewer,
  unregisterViewer,
  subscribeToActiveViewerCount,
  subscribeToTodayViewCount,
} from '../services/viewerService'
import { Post, Store, PostLocation } from '../types'
import PostForm from '../components/PostForm'
import PostList from '../components/PostList'
import StatsCard from '../components/StatsCard'
import TrendSection from '../components/TrendSection'
import './CommunityBoardPage.css'

const DATA_STORE_ID: Store = 'seikyo'

export default function CommunityBoardPage() {
  useParams<{ storeId: Store }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [todayViews, setTodayViews] = useState(0)
  const [authReady, setAuthReady] = useState(false)
  const [viewerId, setViewerId] = useState<string | null>(null)

  

  // ページ訪問時にセッション登録
  useEffect(() => {
    const registerSession = async () => {
      try {
        console.log('🔄 Registering viewer session for store:', DATA_STORE_ID)
        const id = await registerViewer(DATA_STORE_ID)
        console.log('✅ Session registered with ID:', id)
        setViewerId(id)
      } catch (error) {
        console.error('❌ Failed to register viewer session:', error)
      }
    }

    registerSession()

    // ページ離脱時にセッション削除
    return () => {
      if (viewerId) {
        console.log('🔄 Unregistering viewer session:', viewerId)
        unregisterViewer(viewerId).catch((error) =>
          console.error('❌ Failed to unregister viewer:', error)
        )
      }
    }
  }, [])

  // リアルタイム閲覧者数の購読
  useEffect(() => {
    const unsubscribeViewerCount = subscribeToActiveViewerCount(
      DATA_STORE_ID,
      setViewerCount
    )
    const unsubscribeTodayViews = subscribeToTodayViewCount(
      DATA_STORE_ID,
      setTodayViews
    )

    return () => {
      unsubscribeViewerCount()
      unsubscribeTodayViews()
    }
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

  // 認証初期化
  useEffect(() => {
    const initialize = async () => {
      await initializeAuth()
      setAuthReady(true)
    }

    initialize()
  }, [])

  // HOTな場所上位3と、みんなのきもち（絵文字）上位3を算出
  const calculateHotAndFeelings = () => {
    const locationCounts = new Map<string, number>()
    const feelingCounts = new Map<string, number>()

    posts.forEach((post) => {
      if (post.location) {
        locationCounts.set(post.location, (locationCounts.get(post.location) || 0) + 1)
      }
      const emoji = post.emoji || '😊'
      feelingCounts.set(emoji, (feelingCounts.get(emoji) || 0) + 1)
    })

    const hotLocations = Array.from(locationCounts.entries())
      .map(([location, count]) => {
        const emoji = location.slice(0, location.indexOf(' '))
        const label = location.slice(location.indexOf(' ') + 1)
        return { emoji, label, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const feelings = Array.from(feelingCounts.entries())
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    return { hotLocations, feelings }
  }

  

  

  const handleSubmitPost = async (
    content: string,
    emoji: string,
    location?: PostLocation
  ) => {
    setIsLoading(true)
    try {
      if (!authReady) {
        await initializeAuth()
        setAuthReady(true)
      }
      await createPost(DATA_STORE_ID, content, emoji, location)
    } catch (error) {
        console.error('投稿失敗:', error)
        const msg = error instanceof Error ? `${error.message}` : '投稿に失敗しました'
        alert(`投稿に失敗しました: ${msg}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="community-board-page">
      <header className="page-header">
        <h1 className="poppy-title">生協　今どんな感じ！？</h1>
        <p className="page-subtitle">あなたの今でつながる生協</p>
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

        <TrendSection {...calculateHotAndFeelings()} />

        <PostForm onSubmit={handleSubmitPost} isLoading={isLoading} />

        <PostList posts={posts} />

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
