import { inc } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { canUseDOM } from '../utils/common-util'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
`

const createContainer = (id) => {
  if (canUseDOM()) {
    if (id) {
      // use the existing div by id if already exist.
      const container = document.getElementById(id)
      if (container) {
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

const eventOption = {
  once: true,
  passive: true,
}

const RootPortal = (props) => {
  const { id, children, className, itemScope, itemType } = props
  const [, forceUpdate] = useState(0)
  const portalContainer = useMemo(() => createContainer(id), [id])
  const shouldRender = !portalContainer || !portalContainer.style.zIndex || portalContainer.dataset.final

  useEffect(() => {
    if (portalContainer && portalContainer.style.zIndex && !portalContainer.dataset.final) {
      const handleUpdate = () => {
        portalContainer.dataset.final = true
        portalContainer.removeEventListener('mousemove', handleUpdate)
        portalContainer.removeEventListener('touchstart', handleUpdate)
        forceUpdate(inc)
      }
      portalContainer.addEventListener('mousemove', handleUpdate, eventOption)
      portalContainer.addEventListener('touchstart', handleUpdate, eventOption)
    }
    return removeContainer(portalContainer)
    // remove the div container when unmounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return shouldRender && canUseDOM() && ReactDOM.createPortal(
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
