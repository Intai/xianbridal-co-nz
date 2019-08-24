import React, { useCallback } from 'react'
import { useBdux } from 'bdux'
import { LocationAction } from 'bdux-react-router'
import styled from 'styled-components'
import { smallWidth } from './device'

const AnchorContainer = styled.a`
  display: inline-block;
`

const imageMargin = ({ hasText }) => `
  margin: ${hasText
    ? '8px 10px'
    : '8px 0 0 10px'
  };
`

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
    transform: scale3d(1.5, 1.5, 1);
  }
`

const Text = styled.span`
  vertical-align: top;
  line-height: 64px;

  @media (max-width: ${smallWidth}) {
    display: none;
  }
`

const pushLocation = (href) => (e) => {
  if (/^\//.test(href)) {
    e.preventDefault()
    return LocationAction.push(href)
  }
}

const renderIcon = ({ children, icon, text }) => (
  <Image
    hasText={children || text}
    src={`/static/icons/${icon}.svg`}
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
  const { href, target, className} = props
  const { bindToDispatch } = useBdux(props)
  const handleClick = useCallback(bindToDispatch(pushLocation(href)), [href, bindToDispatch])

  return (
    <AnchorContainer
      className={className}
      href={href}
      onClick={handleClick}
      rel="noreferrer noopener"
      target={target}
    >
      {renderIcon(props)}
      {renderText(props)}
    </AnchorContainer>
  )
}

export default Anchor
