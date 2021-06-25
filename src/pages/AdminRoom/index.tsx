import { useHistory, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

// import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { useTheme } from '../../hooks/useTheme'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'
import { SwitchTheme } from '../../components/SwitchTheme'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'

import logoImg from '../../assets/images/logo.svg'
import logoDarkImg from '../../assets/images/logo-dark.svg'
import emptyQuestionsImg from '../../assets/images/empty-questions.svg'
import './styles.scss'

type AdminRoomParams = {
  id: string;
}

export function AdminRoom(): JSX.Element {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<AdminRoomParams>()
  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  const { theme } = useTheme()

  async function handleEndRoom() {
    try {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })

      toast.success(`Sala encerrada com sucesso!`)
      history.push('/')
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível encerrar a sala. Tente novamente')
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    // TODO implement react-modal for confirmation
    try {
      if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        toast.success('Pergunta excluída com sucesso!')
      }

    } catch (error) {
      console.log(error)
      toast.error('Não foi possível excluir pergunta')
    }
  }

  return (
    <div id="page-admin-room" className={`${theme}-theme`}>
      <header>
        <div className="content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" onClick={() => history.push('/')} />

          <div>
            <RoomCode code={roomId} theme={`${theme}-theme`} />
            <Button isOutlined={theme === 'light'} onClick={handleEndRoom}>Encerrar sala</Button>
            <SwitchTheme />
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length === 1 ? (
            <span>{questions.length} pergunta</span>
          ) : questions.length > 1 && <span>{questions.length} perguntas</span>}
        </div>

        { questions.length > 0 ? (
          <div className="question-list">
            {questions.map(question => {
              return (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                  theme={`${theme}-theme`}
                >
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </Question>
              )
            })}
          </div>

        ) : (
          <div className="empty-questions">
            <img src={emptyQuestionsImg} alt="Nenhuma pergunta por aqui" />
            <strong>Nenhuma pergunta por aqui...</strong>
            <span>Envie o código desta sala para seus amigos e comece a responder perguntas!</span>
          </div>
        ) }
      </main>
    </div>
  )
}
