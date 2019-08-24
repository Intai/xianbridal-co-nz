import React from 'react'
import styled from 'styled-components'
import { useBdux, createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import BackgroundStore from '../stores/background-store'

const imageSrc = ({ src }) => `
  background-image: url(${src});
  background-size: cover;
`

const imageSelected = ({ selected }) => selected === true && `
  transition: opacity 250ms ease-out;
  opacity: 1
`

const imageDeselected = ({ selected }) => selected === false && `
  transition: opacity 250ms ease-out;
  opacity: 0
`

const imageSlideShow = ({ selected, index }) => {
  if (selected === null) {
    const fadein = (index > 0 )
      ? `${index * 25 - 5}% { opacity: 0; }`
      : ''
    const fadeout = (index < 3)
      ? `${(index + 1) * 25 + 5}% { opacity: 0; }`
      : ''

    return `
      opacity: 0;
      animation: 10s infinite alternate slideshow-${index};
      @keyframes slideshow-${index} {
        ${fadein}
        ${index * 25}% { opacity: 1; }
        ${(index + 1) * 25}% { opacity: 1; }
        ${fadeout}
      }
    `
  }
}

const Image = styled.div`
  ${imageSrc}
  ${imageSelected}
  ${imageDeselected}
  ${imageSlideShow}
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const getSelectedFor = (category, selected) => (
  (typeof selected === 'string')
    ? selected === category
    : null
)

const Background = (props) => {
  const { state } = useBdux(props, { background: BackgroundStore })
  const { background } = state
  const { match: { params: { category } } } = props
  const selected = (background && background.selected) || category

  return (
    <>
      <Image
        index={0}
        selected={getSelectedFor('gowns', selected)}
        src="/static/images/background/gowns1.jpg"
      />
      <Image
        index={1}
        selected={getSelectedFor('sales', selected)}
        src="/static/images/background/gowns2.jpg"
      />
      <Image
        index={2}
        selected={getSelectedFor('accessories', selected)}
        src="/static/images/background/accessories.jpg"
      />
      <Image
        index={3}
        selected={getSelectedFor('search', selected)}
        src="/static/images/background/search.jpg"
      />
    </>
  )
}

const useBduxForRoutes = createUseBdux(
  { location: LocationStore },
  // start listening to browser history.
  LocationAction.listen
)

const BackgroundRoutes = (props) => {
  const { state } = useBduxForRoutes(props)
  const { location } = state

  return !!location && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={Background}
          path="/:category/:id?"
        />
        <Route
          component={Background}
          path="/"
        />
      </Switch>
    </Router>
  )
}

export default BackgroundRoutes
