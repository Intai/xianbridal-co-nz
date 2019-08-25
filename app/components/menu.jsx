import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'bdux-react-router'
import { useBdux, createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import { fontSans } from './typography'
import {
  textWhite,
  backgroundLavender,
} from './color'
import * as BackgroundAction from '../actions/background-action'

const List = styled.ul`
  ${fontSans}
  ${textWhite}
  font-size: 200%;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 219px;
  left: 20px;
  padding: 10px 0;
`

const MenuLink = styled(Link)`
  text-decoration: none;
  padding: 5px 20px;
  display: block;

  &:hover {
    ${backgroundLavender}
  }
`

const useSelectCategory = (category, dispatch) => (
  useCallback(() => dispatch(BackgroundAction.select(category)), [dispatch])
)

const Menu = (props) => {
  const { dispatch } = useBdux(props)
  const selectGowns = useSelectCategory('gowns', dispatch)
  const selectSales = useSelectCategory('sales', dispatch)
  const selectAccessories = useSelectCategory('accessories', dispatch)
  const selectSearch = useSelectCategory('search', dispatch)
  const deselectBackground = useSelectCategory(null, dispatch)

  return (
    <List onMouseLeave={deselectBackground}>
      <li>
        <MenuLink
          onMouseEnter={selectGowns}
          to="/gowns"
        >
          {'Wedding Gowns'}
        </MenuLink>
      </li>
      <li>
        <MenuLink
          onMouseEnter={selectSales}
          to="/sales"
        >
          {'Sample Sales'}
        </MenuLink>
      </li>
      <li>
        <MenuLink
          onMouseEnter={selectAccessories}
          to="/accessories"
        >
          {'Accessories'}
        </MenuLink>
      </li>
      <li>
        <MenuLink
          onMouseEnter={selectSearch}
          to="/search"
        >
          {'Search'}
        </MenuLink>
      </li>
    </List>
  )
}

const CompactMenu = (props) => (
  Menu({ ...props, isCompact: true })
)

const useBduxForRoutes = createUseBdux(
  { location: LocationStore },
  // start listening to browser history.
  LocationAction.listen
)

const MenuRoutes = (props) => {
  const { state } = useBduxForRoutes(props)
  const { location } = state

  return !!location && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={CompactMenu}
          path="/:category/:id?"
        />
        <Route
          component={Menu}
          path="/"
        />
      </Switch>
    </Router>
  )
}

export default MenuRoutes
