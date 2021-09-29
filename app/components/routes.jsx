import React from 'react'
import { createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import Home from './home'
import Catalogue from './catalogue'

const useBdux = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const Routes = (props) => {
  const { state } = useBdux(props)
  const { location } = state

  return !!location && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={Catalogue}
          path="/search/:query/:id?"
        />
        <Route
          component={Catalogue}
          path="/:category/:id?"
        />
        <Route
          component={Home}
          path="/"
        />
      </Switch>
    </Router>
  )
}

export default Routes
