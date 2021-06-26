import { ReactNode } from 'react'
import cx from 'classnames'
import './styles.scss'

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  children?: ReactNode;
  theme?: string;
  isAnswered?: boolean;
  isHighlighted?: boolean;
}

export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
  theme = ''
}: QuestionProps): JSX.Element {
  return (
    <div
      className={
        cx(
          'question',
          theme,
          { answered: isAnswered },
          { highlighted: isHighlighted && !isAnswered },
        )
      }
    >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}
