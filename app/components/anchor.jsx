import React from 'react'
import styled from 'styled-components'

const AnchorContainer = styled.a`
  display: inline-block;
`

const Image = styled.div`
  transition: transform 250ms ease-out;
  background: url(${({ src }) => src});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;
  position: relative;
  display: inline-block;
  height: 48px;
  width: 48px;
  margin: 8px 10px;

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
`

const renderIcon = ({ icon }) => (
  <Image src={`/static/icons/${icon}.svg`} />
)

const renderText = ({ children, itemProp, text }) => (
  children || (
    <Text itemProp={itemProp}>
      {text}
    </Text>
  )
)

const Anchor = (props) => {
  const { href, target } = props
  return (
    <AnchorContainer
      href={href}
      rel="noreferrer noopener"
      target={target}
    >
      {renderIcon(props)}
      {renderText(props)}
    </AnchorContainer>
  )
}

export default Anchor
