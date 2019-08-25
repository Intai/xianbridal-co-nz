import React from 'react'
import styled from 'styled-components'
import { useBdux, createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Route,
} from 'bdux-react-router'
import BackgroundStore from '../stores/background-store'

const imageSrc = ({ src }) => `
  background-image: url(${src});
  background-size: cover;
  background-position: center;
`

const imageSelected = ({ selected }) => selected && `
  transition: opacity 500ms linear;
  opacity: 1;
`

const imageDeselected = ({ selected }) => !selected && `
  transition: opacity 500ms linear;
  opacity: 0;
`

const imageSlideShow = ({ index }) => {
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

const Image = styled.div`
  ${imageSrc}
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const SlideShowImage = styled(Image)`
  ${imageSlideShow}
`

const BackgroundImage = styled(Image)`
  ${imageSelected}
  ${imageDeselected}
`

const SlideShow = styled.div`
  ${({ isEnabled }) => !isEnabled && 'display: none'}
`

const renderBackground = (selected) => (
  <React.Fragment key="background">
    <BackgroundImage
      selected={selected === 'gowns'}
      src="/static/images/background/gowns1.jpg"
    />
    <BackgroundImage
      selected={selected === 'sales'}
      src="/static/images/background/gowns2.jpg"
    />
    <BackgroundImage
      selected={selected === 'accessories'}
      src="/static/images/background/accessories.jpg"
    />
    <BackgroundImage
      selected={selected === 'search'}
      src="/static/images/background/search.jpg"
    />
  </React.Fragment>
)

const renderSlideShow = (isEnabled) => (
  <SlideShow
    isEnabled={isEnabled}
    key="slideshow"
  >
    <SlideShowImage
      index={0}
      src="/static/images/background/gowns1.jpg"
    />
    <SlideShowImage
      index={1}
      src="/static/images/background/gowns2.jpg"
    />
    <SlideShowImage
      index={2}
      src="/static/images/background/accessories.jpg"
    />
    <SlideShowImage
      index={3}
      src="/static/images/background/search.jpg"
    />
  </SlideShow>
)

const Background = (props) => {
  const { state } = useBdux(props, { background: BackgroundStore })
  const { background } = state
  const { match: { params: { category } } } = props
  const selected = (background && background.selected) || category

  return [
    renderSlideShow(typeof category !== 'string'),
    renderBackground(selected),
  ]
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
      <Route
        component={Background}
        path="/:category?/:id?"
      />
    </Router>
  )
}

export default BackgroundRoutes
