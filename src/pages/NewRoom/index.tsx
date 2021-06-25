import { useState, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoDarkImg from '../../assets/images/logo-dark.svg'

import { Button } from '../../components/Button'
import { SwitchTheme } from '../../components/SwitchTheme'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { database } from '../../services/firebase'
import './styles.scss'

export function NewRoom(): JSX.Element {
  const { user } = useAuth()
  const { theme } = useTheme()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() === '') return

    try {
      const roomRef = database.ref('rooms')
      const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
      })

      history.push(`/admin/rooms/${firebaseRoom.key}`)

    } catch (error) {
      console.log(error)
      toast.error('Não foi possível criar uma sala')
    }
  }

  return (
    <div id="page-new-room" className={`${theme}-theme`}>
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>

      <main>
        <div className="toggle-theme-container">
          <SwitchTheme />
        </div>
        <div className="main-content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />

            <Button type="submit">
              Criar sala
            </Button>
          </form>

          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
