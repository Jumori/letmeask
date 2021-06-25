import { Link, useHistory } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import logoDarkImg from '../../assets/images/logo-dark.svg'

import { Button } from '../../components/Button'
import { SwitchTheme } from '../../components/SwitchTheme'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { database } from '../../services/firebase'
import './styles.scss'

type FormData = {
  newRoom: string;
}

const schema = Yup.object().shape({
  newRoom: Yup
    .string()
    .required('Nome da sala obrigatório')
    .min(3, 'Nome da sala deve ter no mínimo 3 caracteres')
    .max(20, 'Nome da sala deve ter no máximo 20 caracteres')
})

export function NewRoom(): JSX.Element {
  const { user } = useAuth()
  const { theme } = useTheme()
  const history = useHistory()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  async function handleCreateRoom(data: FormData) {
    try {
      const roomRef = database.ref('rooms')
      const firebaseRoom = await roomRef.push({
        title: data.newRoom,
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
          <form onSubmit={handleSubmit(handleCreateRoom)}>
            <input
              type="text"
              placeholder="Nome da sala"
              {...register('newRoom')}
              className={`${errors.newRoom ? 'field-error' : ''}`}
            />
            {errors.newRoom && <span className="form-error">{errors.newRoom.message}</span>}

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
