import { ReactNode } from 'react'
import ReactModal from 'react-modal'

import './styles.scss'

type ModalProps = {
  isOpen: boolean;
  onModalClose: () => void;
  children: ReactNode;
  theme?: string;
}

ReactModal.setAppElement('#root')

export function Modal({ children, isOpen, onModalClose, theme = 'light' }: ModalProps): JSX.Element {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onModalClose}
      portalClassName={`ReactModalPortal custom-modal ${theme}-theme`}
      closeTimeoutMS={200}
    >
      {children}
    </ReactModal>
  )
}
