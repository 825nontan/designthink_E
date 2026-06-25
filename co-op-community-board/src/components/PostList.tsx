import { Post } from '../types'
import PostCard from './PostCard'
import './PostList.css'

interface PostListProps {
  posts: Post[]
  onLike: (postId: string) => void
}

export default function PostList({ posts, onLike }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <p>まだ投稿がありません</p>
        <p className="empty-subtext">最初の投稿をしてみましょう！</p>
      </div>
    )
  }

  return (
    <div className="post-list">
      <h2 className="posts-title">💬 みんなの投稿</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={onLike} />
      ))}
    </div>
  )
}
