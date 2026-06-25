import { useState, useEffect } from 'react'
import { PostLocation } from '../types'
import './PostForm.css'

interface PostFormProps {
  onSubmit: (content: string, emoji: string, location?: PostLocation) => Promise<void>
  isLoading: boolean
}

const hints = [
  '今日何買う？',
  'パンまだある？',
  'おすすめ見つけた？',
  '今日は混んでる？',
  '今日のお昼何にする？',
  '気になる商品あった？',
  '文房具コーナーどう？',
  'レジ早い？',
  '新商品見つけた？',
  '暑いね…',
]

const locationOptions: PostLocation[] = [
  '🥐 焼きたてパン',
  '🍱 お弁当・おにぎり',
  '🍜 インスタント麺・スープ',
  '🍨 アイス',
  '🍬 お菓子',
  '📕 書籍',
  '🧃 飲み物',
  '✏️ 文房具',
  '🛒 レジ',
  '🍪 火・木限定チャンククッキー',
  '✨ その他',
]

export default function PostForm({ onSubmit, isLoading }: PostFormProps) {
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('😊')
  const [selectedLocation, setSelectedLocation] = useState<PostLocation | undefined>()
  const [hintIndex, setHintIndex] = useState(() => Math.floor(Math.random() * hints.length))

  const handleSubmit = async () => {
    if (content.trim().length === 0) return
    try {
      await onSubmit(content, emoji, selectedLocation)
      setContent('')
      setEmoji('😊')
      setSelectedLocation(undefined)
    } catch (error) {
      console.error('投稿エラー:', error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const hint = hints[hintIndex]
  const remainingChars = 50 - content.length

  return (
    <div className="post-form">
      <div className="form-hint-card">
        <div className="form-hint-tagline">みんなにおしえてみよう！</div>
        <div className="form-hint">{hint}</div>
      </div>

      <div className="form-input-group">
        <div className="location-section">
          <label className="location-label">どこの話か選んでみよう</label>
          <select
            value={selectedLocation || ''}
            onChange={(e) => setSelectedLocation(e.target.value ? (e.target.value as PostLocation) : undefined)}
            className="location-select"
          >
            <option value="">場所を選択...</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="emoji-section">
          <label className="emoji-label">今の気持ちにぴったりな絵文字は？</label>
          <div className="emoji-selector">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value.slice(0, 2))}
              maxLength={2}
              className="emoji-input"
            />
            <div className="emoji-help">絵文字とコメントが一緒に投稿されます</div>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 50))}
          placeholder="ここに投稿を入力..."
          maxLength={50}
          className="post-textarea"
          rows={3}
        />
      </div>

      <div className="form-footer">
        <div className="char-count">
          残り: {remainingChars}文字
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || content.trim().length === 0}
        className="submit-button"
      >
        {isLoading ? '投稿中...' : '投稿する'}
      </button>
    </div>
  )
}
