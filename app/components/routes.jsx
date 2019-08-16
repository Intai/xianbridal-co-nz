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
import Product from './product'

const useBdux = createUseBdux({
  location: LocationStore
},
// start listening to browser history.
LocationAction.listen)

const Routes = (props) => {
  const { state, dispatch } = useBdux(props)
  const { location } = state

  console.log('location', location)
  return !!location && (
    <Router history={createLocationHistory(location, dispatch)}>
      <Switch>
        <Route
          component={Product}
          path="/:id"
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
