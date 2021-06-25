import { useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

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

type FormData = {
  roomCode: string;
}

const schema = Yup.object().shape({
  roomCode: Yup.string().required('Código obrigatório')
})

export function Home(): JSX.Element {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const { theme } = useTheme()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

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

  async function handleJoinRoom(data: FormData) {
    try {
      const roomRef = await database.ref(`rooms/${data.roomCode}`).get()

      if (!roomRef.exists()) {
        return toast.error('Sala inválida')
      }

      if (roomRef.val().endedAt) {
        return toast.error('Sala já encerrada')
      }

      history.push(`/rooms/${data.roomCode}`)
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

          <form onSubmit={handleSubmit(handleJoinRoom)}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              {...register('roomCode')}
              className={`${errors.roomCode ? 'field-error' : ''}`}
            />
            {errors.roomCode && <span className="form-error">{errors.roomCode.message}</span>}

            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
