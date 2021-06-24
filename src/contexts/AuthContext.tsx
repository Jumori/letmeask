import { createContext, ReactNode, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { auth, firebase } from '../services/firebase'
import userImg from '../assets/images/user.svg'

type User = {
  id: string
  name: string
  avatar: string
}

export type AuthContextType = {
  user: User | undefined
  signInWithGoogle: () => Promise<User | null>
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(
  props: AuthContextProviderProps,
): JSX.Element {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      try {
        if (user) {
          const { displayName, photoURL, uid } = user

          if (!displayName) {
            throw new Error('Missing account information.')
          }

          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL || userImg,
          })
        }
      } catch (error) {
        console.log(error)
        toast.error('Ops! Parece que sua conta não possui nome de apresentação e/ou foto')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    try {
      const result = await auth.signInWithPopup(provider)

      if (!result.user) return null

      const { displayName, photoURL, uid } = result.user

      if (!displayName) {
        throw new Error('Missing account information.')
      }

      const userData = {
        id: uid,
        name: displayName,
        avatar: photoURL || userImg,
      }

      setUser(userData)

      return userData
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
