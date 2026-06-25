import { Post } from '../types'
import './PostCard.css'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const timeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return '今'
    if (diffMins < 60) return `${diffMins}分前`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}時間前`
    return `${Math.floor(diffHours / 24)}日前`
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="post-emoji">{post.emoji || '😊'}</span>
        <span className="post-location">{post.location || ''}</span>
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-footer">
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>
    </div>
  )
}
