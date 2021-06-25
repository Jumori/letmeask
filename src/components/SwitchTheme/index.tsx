import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

import './styles.scss'

export function SwitchTheme(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const [switchToggle, setSwitchToggle] = useState(theme !== 'light')

  function handleSwitchToggle() {
    toggleTheme()
    setSwitchToggle(!switchToggle)
  }

  return (
    <label className="switch">
      <input type="checkbox" onChange={handleSwitchToggle} checked={switchToggle} />
      <div className="slider round">
        <span className="dark-theme">Dark</span>
        <span className="light-theme">Light</span>
      </div>
    </label>
  )
}
