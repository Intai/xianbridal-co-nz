import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router'
import { useBdux, createUseBdux } from 'bdux/hook'
import {
  LocationAction,
  LocationStore,
  Router,
  Routes,
  Route,
  updateRouterLocation,
} from 'bdux-react-router'
import BackgroundStore from '../stores/background-store'
import { getImageUrl } from '../utils/common-util'

const imageWithCategory = ({ hasCategory }) => hasCategory && `
  filter: opacity(25%);
`

const imageSelected = ({ isSelected }) => `
  opacity: ${isSelected ? 1 : 0};
`

const Image = styled.img`
  ${imageWithCategory}
  ${imageSelected}
  transition: filter 500ms linear, opacity 500ms linear;
  object-fit: cover;
  object-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;

  @media (max-width: 480px) {
    filter: blur(2px);
  }
`

const getSrcSet = (filename) => {
  return `${getImageUrl(`/background/${filename}-480.webp`)} 480w, \
${getImageUrl(`/background/${filename}-960.webp`)} 960w, \
${getImageUrl(`/background/${filename}-1920.webp`)} 1920w`
}

const srcSizes = '\
(max-width: 480px) and (-webkit-device-pixel-ratio: 4) 240px, \
(max-width: 480px) and (-webkit-device-pixel-ratio: 3) 320px, \
(max-width: 480px) and (-webkit-device-pixel-ratio: 2) 240px, \
(max-width: 480px) 480px, \
1920px'

const renderBackground = (category, selected) => (
  <>
    <Image
      alt="Gowns background"
      hasCategory={!!category}
      isSelected={!selected || selected === 'gowns'}
      src={getImageUrl('/background/gowns2-1920.webp')}
      srcSet={getSrcSet('gowns2')}
      sizes={srcSizes}
    />
    <Image
      alt="Sales background"
      hasCategory={!!category}
      isSelected={selected === 'sales'}
      src={getImageUrl('/background/gowns1-1920.webp')}
      srcSet={getSrcSet('gowns1')}
      sizes={srcSizes}
    />
    <Image
      alt="Accessories background"
      hasCategory={!!category}
      isSelected={selected === 'accessories'}
      src={getImageUrl('/background/accessories-1920.webp')}
      srcSet={getSrcSet('accessories')}
      sizes={srcSizes}
    />
    <Image
      alt="Search background"
      hasCategory={!!category}
      isSelected={selected === 'search'}
      src={getImageUrl('/background/search-1920.webp')}
      srcSet={getSrcSet('search')}
      sizes={srcSizes}
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
  const { category } = useParams()
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
    } else {
      setCurrent(category)
    }
  }, [category, selected])

  return renderBackground(category, current)
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
    <Router location={updateRouterLocation(location)}>
      <Routes>
        <Route
          element={<Background />}
          path="/:category/*"
        />
        <Route
          element={<Background />}
          index
        />
      </Routes>
    </Router>
  )
}

export default BackgroundRoutes
