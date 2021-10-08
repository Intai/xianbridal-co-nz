import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useBdux, createUseBdux } from 'bdux/hook'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Route,
} from 'bdux-react-router'
import BackgroundStore from '../stores/background-store'
import { getImageUrl } from '../utils/common-util'

const imageSelected = ({ isSelected }) => `
  opacity: ${isSelected ? 1 : 0};
`

const Image = styled.img`
  ${imageSelected}
  transition: opacity 500ms linear;
  object-fit: cover;
  object-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
`

const renderBackground = (selected) => (
  <>
    <Image
      isSelected={!selected || selected === 'gowns'}
      src={getImageUrl('/background/gowns2.webp')}
    />
    <Image
      isSelected={selected === 'sales'}
      src={getImageUrl('/background/gowns1.webp')}
    />
    <Image
      isSelected={selected === 'accessories'}
      src={getImageUrl('/background/accessories.webp')}
    />
    <Image
      isSelected={selected === 'search'}
      src={getImageUrl('/background/search.webp')}
    />
  </>
)

const selectNext = prev => {
  switch(prev) {
  case 'gowns':
    return 'sales'
  case 'sales':
    return 'accessories'
  case 'accessories':
    return 'search'
  default:
    return 'gowns'
  }
}

const Background = (props) => {
  const { state } = useBdux(props, { background: BackgroundStore })
  const { background } = state
  const { match: { params: { category } } } = props
  const selected = background && background.selected
  const [current, setCurrent] = useState(selected || category)
  const refInterval = useRef()

  useEffect(() => {
    clearInterval(refInterval.current)
    if (selected) {
      setCurrent(selected)
    } else if (!category) {
      refInterval.current = setInterval(() => {
        setCurrent(selectNext)
      }, 5000)
    }
  }, [category, selected])

  return renderBackground(current)
}

const useBduxForRoutes = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const BackgroundRoutes = (props) => {
  const { state } = useBduxForRoutes(props)
  const { location } = state

  return (
    <Router history={createLocationHistory(location)}>
      <Route
        component={Background}
        path="/:category?"
      />
    </Router>
  )
}

export default BackgroundRoutes
