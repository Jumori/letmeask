import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoDarkImg from '../../assets/images/logo-dark.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { database } from '../../services/firebase'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

import { Button } from '../../components/Button'
import { SwitchTheme } from '../../components/SwitchTheme'

import './styles.scss'

export function Home(): JSX.Element {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const { theme } = useTheme()

  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if (user) {
      history.push('/rooms/new')
    } else {
      try {
        const userStatus = await signInWithGoogle()
        if (!userStatus) {
          throw new Error('Invalid user')
        }

        history.push('/rooms/new')

      } catch (error) {
        console.log(error)
        toast.error('Não foi possível realizar login')
      }
    }
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') return

    try {
      const roomRef = await database.ref(`rooms/${roomCode}`).get()

      if (!roomRef.exists()) {
        return toast.error('Sala inválida')
      }

      if (roomRef.val().endedAt) {
        return toast.error('Sala já encerrada')
      }

      history.push(`/rooms/${roomCode}`)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível acessar sala')
    }

  }

  return (
    <div id="page-home" className={`${theme}-theme`}>
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="toggle-theme-container">
          <SwitchTheme />
        </div>
        <div className="main-content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
