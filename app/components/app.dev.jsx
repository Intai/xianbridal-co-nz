import React from 'react'
import { useBdux } from 'bdux'
import { TimeTravel } from 'bdux-timetravel'
import { ThemeProvider } from 'styled-components'
import Theme from './theme'

export const App = (props) => {
  useBdux(props)
  return (
    <ThemeProvider theme={Theme}>
      <TimeTravel />
    </ThemeProvider>
  )
}

export default App
