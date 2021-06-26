import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

// import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { useTheme } from '../../hooks/useTheme'
import { database } from '../../services/firebase'

import { Button } from '../../components/Button'
import { SwitchTheme } from '../../components/SwitchTheme'
import { Modal } from '../../components/Modal'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'

import logoImg from '../../assets/images/logo.svg'
import logoDarkImg from '../../assets/images/logo-dark.svg'
import emptyQuestionsImg from '../../assets/images/empty-questions.svg'
import trashImg from '../../assets/images/trash.svg'
import xCircleImg from '../../assets/images/x-circle.svg'
import './styles.scss'

type AdminRoomParams = {
  id: string;
}

export function AdminRoom(): JSX.Element {
  // const { user } = useAuth()
  const history = useHistory()
  const params = useParams<AdminRoomParams>()
  const roomId = params.id

  const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>()
  const [endRoomModalOpen, setEndRoomModalOpen] = useState(false)

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

  async function handleDeleteQuestion(questionId: string | undefined) {
    if (!questionId) return

    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()

      toast.success('Pergunta excluída com sucesso!')
      setQuestionIdModalOpen(undefined)
    } catch (error) {
      console.log(error)
      toast.error('Não foi possível excluir pergunta')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string | undefined, isAnswered: boolean) {
    if (!questionId) return

    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: !isAnswered,
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function handleHighlightQuestion(questionId: string | undefined, isHighlighted: boolean) {
    if (!questionId) return

    try {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: !isHighlighted,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div id="page-admin-room" className={`${theme}-theme`}>
      <header>
        <div className="content">
          <img src={theme === 'light' ? logoImg : logoDarkImg} alt="Letmeask" onClick={() => history.push('/')} />

          <div>
            <RoomCode code={roomId} theme={`${theme}-theme`} />
            <Button isOutlined={theme === 'light'} onClick={() => setEndRoomModalOpen(true)}>Encerrar sala</Button>
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
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                  theme={`${theme}-theme`}
                >
                  <button
                    type="button"
                    className={`check-button ${question.isAnswered ? 'answered' : ''}`}
                    onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={`highlight-button ${question.isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => setQuestionIdModalOpen(question.id)}
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

      <Modal
        isOpen={!!questionIdModalOpen}
        onModalClose={() => setQuestionIdModalOpen(undefined)}
        theme={theme}
      >
        <div className="body">
          <div className="body-container">
            <img src={trashImg} alt="Ícone de lixeira" />
            <h2>Excluir pergunta</h2>
            <p>Tem certeza que você deseja excluir esta pergunta?</p>
          </div>
          <div className="action-button-container">
            <button
              className="action-button secondary"
              onClick={() => setQuestionIdModalOpen(undefined)}
            >Cancelar</button>
            <button
              className="action-button primary"
              onClick={() => handleDeleteQuestion(questionIdModalOpen)}
            >Sim, excluir</button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={endRoomModalOpen}
        onModalClose={() => setEndRoomModalOpen(false)}
        theme={theme}
      >
        <div className="body">
          <div className="body-container">
            <img src={xCircleImg} alt="Ícone de exclusão" />
            <h2>Encerrar sala</h2>
            <p>Tem certeza que você deseja encerrar esta sala?</p>
          </div>
          <div className="action-button-container">
            <button
              className="action-button secondary"
              onClick={() => setEndRoomModalOpen(false)}
            >Cancelar</button>
            <button
              className="action-button primary"
              onClick={handleEndRoom}
            >Sim, encerrar</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
