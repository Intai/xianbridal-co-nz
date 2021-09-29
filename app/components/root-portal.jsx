import React, { useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Common from '../utils/common-util'

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const createContainer = () => {
  if (Common.canUseDOM()) {
    const container = document.createElement('div')
    const app = document.getElementById('app')
    if (app && app.firstChild) {
      app.insertBefore(container, app.firstChild.nextSibling)
    } else {
      document.body.appendChild(container)
    }
    return container
  }
}

const removeContainer =  (portalContainer) => () => {
  if (Common.canUseDOM()) {
    portalContainer.parentNode.removeChild(portalContainer)
  }
}

const RootPortal = (props) => {
  const portalContainer = useMemo(createContainer, [])
  useEffect(() => removeContainer(portalContainer),
    // remove the div container when unmounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

  return ReactDOM.createPortal(
    <Container
      className={props.className}
      itemScope={props.itemScope}
      itemType={props.itemType}
    >
      {props.children}
    </Container>,
    portalContainer,
  )
}

export default RootPortal
