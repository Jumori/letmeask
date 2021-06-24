import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'

import { AuthContextProvider } from './contexts/AuthContext'
import { ThemeContextProvider } from './contexts/ThemeContext'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeContextProvider>
        <AuthContextProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/rooms/new" component={NewRoom} />
            <Route path="/rooms/:id" component={Room} />
          </Switch>
        </AuthContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  )
}

export default App
