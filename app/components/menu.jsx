import React, { useCallback, useState } from 'react'
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
import SearchInput from './search-input'
import { fontTitle } from './typography'
import {
  businessCardFullWidth,
  businessCardFullHeight,
} from './dimension'
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

  @media (max-width: ${businessCardFullWidth(props)}),
    (max-height: ${businessCardFullHeight(props)}) {
    top: 149px;
  }
`

const compactList = ({ isCompact }) => isCompact && `
  font-size: 150%;
  top: 0;
  left: 68px;

  @media (orientation: portrait) {
    opacity: 0;
  }
`

const listPosition =({ isCompact }) => `
  position: ${isCompact ? 'fixed' : 'absolute'};
`

const List = styled.ul`
  ${fontTitle}
  ${textWhite}
  ${fullList}
  ${compactList}
  ${listPosition}
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.5);
  transition-property: top, left, opacity;
  transition-duration: 250ms;
  transition-timing-function: ease-out;

  @media (min-width: 589px) and (min-height: 620px),
    (min-width: 497px) and (min-height: 736px),
    (min-width: 298px) and (min-height: 780px),
    (max-width: 297px) and (min-height: 896px) {
    position: fixed;
  }
`

const compactListItem = ({ isCompact }) => isCompact && `
  display: inline-block;
`

const ListItem = styled.li`
  ${compactListItem}
  position: relative;
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
  !isCompact && isSelected && `
    background: ${theme.color.lavender};
  `
)

const selectedCompactLink = ({ isCompact, isSelected, theme }) => (
  isCompact && isSelected && `
    &:after {
      background: ${theme.color.offLavender};
    }
  `
)

const StripLink = ({ children, className, onMouseEnter, onMouseUp, to }) => (
  <Link
    className={className}
    onMouseEnter={onMouseEnter}
    onMouseUp={onMouseUp}
    to={to}
  >
    {children}
  </Link>
)

const MenuLink = styled(StripLink)`
  ${fullMenuLink}
  ${compactMenuLink}
  ${selectedMenuLink}
  ${selectedCompactLink}
  text-decoration: none;
  display: block;
  position: relative;

  &:hover {
    ${backgroundLavender}
  }
`

const scrollToTop = () => {
  window.scrollTo(0, 0)
}

const useSelectCategory = (category, dispatch, setIsSearching) => (
  useCallback(() => {
    dispatch(BackgroundAction.select(category))
    if (category && category !== 'search') {
      setIsSearching(false)
    }
  }, [category, dispatch, setIsSearching])
)

const Menu = (props) => {
  const { match: { params: { category } } } = props
  const isCompact = !!category
  const { dispatch } = useBdux(props)
  const [isSearching, setIsSearching] = useState(false)
  const selectGowns = useSelectCategory('gowns', dispatch, setIsSearching)
  const selectSales = useSelectCategory('sales', dispatch, setIsSearching)
  const selectAccessories = useSelectCategory('accessories', dispatch, setIsSearching)
  const selectSearch = useSelectCategory('search', dispatch, setIsSearching)
  const deselectBackground = useSelectCategory(null, dispatch, setIsSearching)
  const showSearchInput = useCallback((e) => {
    setIsSearching(true)
    if (!isCompact) {
      e.preventDefault()
    }
  }, [isCompact])

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
          onMouseUp={scrollToTop}
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
          onMouseUp={scrollToTop}
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
          onMouseUp={scrollToTop}
          to="/accessories"
        >
          {'Accessories'}
        </MenuLink>
      </ListItem>
      <ListItem isCompact={isCompact}>
        <MenuLink
          isCompact={isCompact}
          isSelected={category === 'search' || isSearching}
          onMouseEnter={selectSearch}
          onMouseUp={showSearchInput}
          to="/"
        >
          {'Search'}
        </MenuLink>
        {isSearching && (
          <SearchInput
            dispatch={dispatch}
            setIsSearching={setIsSearching}
          />
        )}
      </ListItem>
    </List>
  )
}

const useBduxForRoutes = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

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
