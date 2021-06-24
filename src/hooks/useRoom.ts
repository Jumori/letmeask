import { useEffect, useState } from "react"
import { database } from "../services/firebase"

type FirebaseQuestion = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
}>

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
}

type UseRoomType = {
  questions: QuestionType[];
  title: string;
}

export function useRoom(roomId: string): UseRoomType {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    // TODO update listener for when a item is changed
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestion = databaseRoom.questions ?? {}
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId])

  return { questions, title }
}
