import { signInAnonymously } from 'firebase/auth'
import { auth } from './firebase'

export const initializeAuth = async (): Promise<void> => {
  try {
    if (auth.currentUser) {
      return
    }
    await signInAnonymously(auth)
  } catch (error) {
    console.error('匿名認証エラー:', error)
  }
}
