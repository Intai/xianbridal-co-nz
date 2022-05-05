import React from 'react'
import { createUseBdux } from 'bdux/hook'
import {
  LocationAction,
  LocationStore,
  Router,
  Routes,
  Route,
  updateRouterLocation,
} from 'bdux-react-router'
import Home from './home'
import Catalogue from './catalogue'

const useBdux = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const MainRoutes = (props) => {
  const { state } = useBdux(props)
  const { location } = state

  return (
    <Router location={updateRouterLocation(location)}>
      <Routes>
        <Route path="/search/:query">
          <Route
            element={<Catalogue />}
            path=":id"
          />
          <Route
            element={<Catalogue />}
            index
          />
        </Route>

        <Route path="/:category">
          <Route
            element={<Catalogue />}
            path=":id"
          />
          <Route
            element={<Catalogue />}
            index
          />
        </Route>

        <Route
          element={<Home />}
          path="/"
        />
      </Routes>
    </Router>
  )
}

export default MainRoutes
