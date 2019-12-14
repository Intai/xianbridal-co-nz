import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'bdux-react-router'
import { useBdux, createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Route,
} from 'bdux-react-router'
import { smallWidth } from './device'
import { fontTitle } from './typography'
import {
  textWhite,
  backgroundLavender,
} from './color'
import * as BackgroundAction from '../actions/background-action'

const fullList = (props) => !props.isCompact && `
  font-size: 200%;
  top: 219px;
  left: 20px;
  padding: 10px 0;

  @media (max-width: ${smallWidth(props)}) {
    top: 149px;
  }
`

const compactList = (props) => props.isCompact && `
  font-size: 150%;
  top: 0;
  left: 68px;

  @media (max-width: ${smallWidth(props)}) {
    opacity: 0;
  }
`

const List = styled.ul`
  ${fontTitle}
  ${textWhite}
  ${fullList}
  ${compactList}
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  transition-property: top, left, opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-out;
`

const compactListItem = ({ isCompact }) => isCompact && `
  display: inline-block;
`

const ListItem = styled.li`
  ${compactListItem}
`

const fullMenuLink = ({ isCompact }) => !isCompact && `
  padding: 5px 20px;
`

const compactMenuLink = ({ isCompact }) => isCompact && `
  padding: 5px 10px 8px 10px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
  }
`

const selectedMenuLink = ({ isCompact, isSelected, theme }) => (
  isCompact && isSelected && `
    &:after {
      background: ${theme.color.offLavender}
    }
  `
)

const StripLink = ({ children, className, onMouseEnter, to }) => (
  <Link
    className={className}
    onMouseEnter={onMouseEnter}
    to={to}
  >
    {children}
  </Link>
)

const MenuLink = styled(StripLink)`
  ${fullMenuLink}
  ${compactMenuLink}
  ${selectedMenuLink}
  text-decoration: none;
  display: block;
  position: relative;

  &:hover {
    ${backgroundLavender}
  }
`

const useSelectCategory = (category, dispatch) => (
  useCallback(() => dispatch(BackgroundAction.select(category)), [dispatch])
)

const Menu = (props) => {
  const { match: { params: { category } } } = props
  const { dispatch } = useBdux(props)
  const selectGowns = useSelectCategory('gowns', dispatch)
  const selectSales = useSelectCategory('sales', dispatch)
  const selectAccessories = useSelectCategory('accessories', dispatch)
  const selectSearch = useSelectCategory('search', dispatch)
  const deselectBackground = useSelectCategory(null, dispatch)
  const isCompact = !!category

  return (
    <List
      isCompact={isCompact}
      onMouseLeave={deselectBackground}
    >
      <ListItem isCompact={isCompact}>
        <MenuLink
          isCompact={isCompact}
          isSelected={category === 'gowns'}
          onMouseEnter={selectGowns}
          to="/gowns"
        >
          {'Wedding Gowns'}
        </MenuLink>
      </ListItem>
      <ListItem isCompact={isCompact}>
        <MenuLink
          isCompact={isCompact}
          isSelected={category === 'sales'}
          onMouseEnter={selectSales}
          to="/sales"
        >
          {'Sample Sales'}
        </MenuLink>
      </ListItem>
      <ListItem isCompact={isCompact}>
        <MenuLink
          isCompact={isCompact}
          isSelected={category === 'accessories'}
          onMouseEnter={selectAccessories}
          to="/accessories"
        >
          {'Accessories'}
        </MenuLink>
      </ListItem>
      <ListItem isCompact={isCompact}>
        <MenuLink
          isCompact={isCompact}
          isSelected={category === 'search'}
          onMouseEnter={selectSearch}
          to="/search"
        >
          {'Search'}
        </MenuLink>
      </ListItem>
    </List>
  )
}

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
      <Route
        component={Menu}
        path="/:category?/:id?"
      />
    </Router>
  )
}

export default MenuRoutes
