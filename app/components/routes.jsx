import React from 'react'
import { createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Route,
} from 'bdux-react-router'
import { ThemeProvider } from 'styled-components'
import Theme from './theme'
import Home from './home'
import Product from './product'

const useBdux = createUseBdux({
  location: LocationStore
},
// start listening to browser history.
LocationAction.listen)

export const App = (props) => {
  const { state } = useBdux(props)
  return (
    <ThemeProvider theme={Theme}>
      <Router history={createLocationHistory(state.location)}>
        <Route
          component={Product}
          path="/:id?"
        />
        <Route
          component={Home}
          path="/"
        />
      </Router>
    </ThemeProvider>
  )
}

export default App
