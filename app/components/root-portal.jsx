import React, { useMemo, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { canUseDOM } from '../utils/common-util'

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`

const createContainer = (id) => {
  if (canUseDOM()) {
    if (id) {
      // use the existing div by id if already exist.
      const container = document.getElementById(id)
      if (container) {
        container?.firstChild?.remove()
        return container
      }
    }
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
  if (canUseDOM()) {
    portalContainer.parentNode.removeChild(portalContainer)
  }
}

const RootPortal = (props) => {
  const { id, children, className, itemScope, itemType } = props
  const portalContainer = useMemo(() => createContainer(id), [id])
  useEffect(() => removeContainer(portalContainer),
    // remove the div container when unmounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

  return canUseDOM() && ReactDOM.createPortal(
    <Container
      className={className}
      itemScope={itemScope}
      itemType={itemType}
    >
      {children}
    </Container>,
    portalContainer,
  )
}

export default RootPortal
