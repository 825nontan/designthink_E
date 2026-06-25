import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { Store } from '../types'

const VIEWERS_COLLECTION = 'viewers'
const DAILY_VIEWS_COLLECTION = 'dailyViews'

const getTodayKey = () => {
  const now = new Date()
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
    .getDate()
    .toString()
    .padStart(2, '0')}`
}

const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

/**
 * ユーザーセッションをFirestoreに登録（ページ訪問時）
 */
export const registerViewer = async (storeId: Store): Promise<string> => {
  try {
    const sessionId = generateSessionId()
    const now = new Date()
    
    // viewersコレクションにセッション追加
    const docRef = await addDoc(collection(db, VIEWERS_COLLECTION), {
      storeId,
      sessionId,
      joinedAt: now,
      lastActiveAt: now,
    })
    console.log('✅ Viewer session registered:', docRef.id)

    // 日次ビュー数を更新
    const viewCountDocId = `${storeId}_${getTodayKey()}`
    const viewCountDocRef = doc(db, DAILY_VIEWS_COLLECTION, viewCountDocId)
    
    console.log('📊 Checking daily view count doc:', viewCountDocId)
    const viewCountDoc = await getDoc(viewCountDocRef)
    console.log('📊 Doc exists:', viewCountDoc.exists(), 'Data:', viewCountDoc.data())

    if (viewCountDoc.exists()) {
      console.log('📊 Incrementing existing view count')
      await updateDoc(viewCountDocRef, {
        totalViews: increment(1),
        lastUpdated: now,
      })
      console.log('✅ View count incremented')
    } else {
      console.log('📊 Creating new daily view count doc')
      await setDoc(viewCountDocRef, {
        storeId,
        date: getTodayKey(),
        totalViews: 1,
        createdAt: now,
        lastUpdated: now,
      })
      console.log('✅ New daily view count doc created')
    }

    return docRef.id
  } catch (error) {
    console.error('❌ Failed to register viewer:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error code:', (error as any).code)
    }
    throw error
  }
}

/**
 * ユーザーセッションを削除（ページ離脱時）
 */
export const unregisterViewer = async (viewerId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, VIEWERS_COLLECTION, viewerId))
  } catch (error) {
    console.error('Failed to unregister viewer:', error)
    throw error
  }
}

/**
 * 現在の閲覧者数をリアルタイムでリッスン
 */
export const subscribeToActiveViewerCount = (
  storeId: Store,
  callback: (count: number) => void
): (() => void) => {
  try {
    const q = query(
      collection(db, VIEWERS_COLLECTION),
      where('storeId', '==', storeId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      callback(snapshot.size)
    })

    return unsubscribe
  } catch (error) {
    console.error('Failed to subscribe to viewer count:', error)
    return () => {}
  }
}

/**
 * 本日の累計閲覧数を取得
 */
export const getTodayViewCount = async (storeId: Store): Promise<number> => {
  try {
    const viewCountDocId = `${storeId}_${getTodayKey()}`
    const viewCountDocRef = doc(db, DAILY_VIEWS_COLLECTION, viewCountDocId)
    const viewCountDoc = await getDoc(viewCountDocRef)

    if (viewCountDoc.exists()) {
      return viewCountDoc.data().totalViews || 0
    }
    return 0
  } catch (error) {
    console.error('Failed to get today view count:', error)
    return 0
  }
}

/**
 * 本日の累計閲覧数をリアルタイムでリッスン
 */
export const subscribeToTodayViewCount = (
  storeId: Store,
  callback: (count: number) => void
): (() => void) => {
  try {
    const viewCountDocId = `${storeId}_${getTodayKey()}`
    const viewCountDocRef = doc(db, DAILY_VIEWS_COLLECTION, viewCountDocId)

    const unsubscribe = onSnapshot(viewCountDocRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data().totalViews || 0)
      } else {
        callback(0)
      }
    })

    return unsubscribe
  } catch (error) {
    console.error('Failed to subscribe to today view count:', error)
    return () => {}
  }
}
