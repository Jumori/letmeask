import React, { ButtonHTMLAttributes } from 'react'

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <button className="button" {...props} />
}
