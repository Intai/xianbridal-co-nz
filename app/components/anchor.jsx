import React, { useMemo } from 'react'
import { useBdux } from 'bdux/hook'
import { LocationAction } from 'bdux-react-router'
import styled from 'styled-components'
import {
  businessCardFullWidth,
  businessCardFullHeight,
} from './dimension'
import { getStaticUrl } from '../utils/common-util'

const maxWidth = ({ maxWidth }) => maxWidth && `
  max-width: ${maxWidth}px;
`

const AnchorContainer = styled.a`
  ${maxWidth}
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  display: inline-block;
  white-space: nowrap;
  touch-callout: none;
  user-select: text;
`

const imageMargin = ({ hasText }) => `
  margin: ${hasText
    ? '8px 10px'
    : '8px 0 0 10px'
};`

const Image = styled.div`
  ${imageMargin}
  transition: transform 250ms ease-out;
  background: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  height: 48px;
  width: 48px;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 2px solid white;
    border-radius: 50%;
  }

  &:hover,
  &:active {
    transform: scale3d(1.3, 1.3, 1);
  }
`

const Text = styled.span`
  vertical-align: top;
  line-height: 64px;

  @media (max-width: ${businessCardFullWidth}),
    (max-height: ${businessCardFullHeight}) {
    display: none;
  }
`

const pushLocation = (href) => (e) => {
  if (/^\//.test(href)) {
    e.preventDefault()
    return LocationAction.push(href)
  }
}

const renderIcon = ({ children, icon, text, title }) => (
  <Image
    hasText={children || text}
    src={getStaticUrl(`/icons/${icon}.svg`)}
    title={title}
  />
)

const renderText = ({ children, itemProp, text }) => (
  children || (!!text && (
    <Text itemProp={itemProp}>
      {text}
    </Text>
  ))
)

const Anchor = (props) => {
  const { href, target, className, maxWidth, onMouseUp } = props
  const { bindToDispatch } = useBdux(props)
  const handleClick = useMemo(() => bindToDispatch(pushLocation(href)), [href, bindToDispatch])

  return (
    <AnchorContainer
      className={className}
      href={href}
      maxWidth={maxWidth}
      onClick={handleClick}
      onMouseUp={onMouseUp}
      rel="noreferrer noopener"
      target={target}
    >
      {renderIcon(props)}
      {renderText(props)}
    </AnchorContainer>
  )
}

export default React.memo(Anchor)
