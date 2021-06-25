import toast from 'react-hot-toast'

import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
  code: string;
  theme?: string;
}

export function RoomCode(props: RoomCodeProps): JSX.Element {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
    toast('Código copiado!')
  }

  return (
    <button className={`room-code ${props.theme ? props.theme : ''}`} onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="Copiar código da sala" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}
