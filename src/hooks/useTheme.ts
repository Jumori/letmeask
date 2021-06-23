import { useContext } from 'react'
import { ThemeContext, ThemeContextType } from '../contexts/ThemeContext'

export function useTheme(): ThemeContextType {
  const value = useContext(ThemeContext)
  return value
}
