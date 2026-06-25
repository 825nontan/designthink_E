import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { Post, Store, PostLocation } from '../types'

export const createPost = async (
  storeId: Store,
  content: string,
  emoji: string,
  location: PostLocation | undefined,
  uid?: string
): Promise<string> => {
  try {
    const postData: Record<string, any> = {
      content,
      emoji,
      location: location || null,
      likes: 0,
      createdAt: serverTimestamp(),
    }
    if (uid) {
      postData.uid = uid
    }

    const docRef = await addDoc(collection(db, `stores/${storeId}/posts`), postData)
    return docRef.id
  } catch (error) {
    console.error('投稿作成エラー:', error)
    throw error
  }
}

export const subscribeToPostsByStore = (
  storeId: Store,
  callback: (posts: Post[]) => void
) => {
  const postsCollection = collection(db, `stores/${storeId}/posts`)
  const q = query(postsCollection, orderBy('createdAt', 'desc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      storeId,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Post[]

    callback(posts)
  })

  return unsubscribe
}

export const likePost = async (storeId: Store, postId: string): Promise<void> => {
  try {
    const postRef = doc(db, `stores/${storeId}/posts/${postId}`)
    const postSnap = await (await import('firebase/firestore')).getDoc(postRef)
    if (postSnap.exists()) {
      await updateDoc(postRef, {
        likes: (postSnap.data().likes || 0) + 1,
      })
    }
  } catch (error) {
    console.error('いいね追加エラー:', error)
    throw error
  }
}
