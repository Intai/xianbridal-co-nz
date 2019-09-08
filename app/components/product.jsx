import React from 'react'
import styled from 'styled-components'

const gridWidth = (width, count, margin) => () => {
  let styles = ''
  for (let i = count; i > 0; --i) {
    styles = `${styles}
      @media (max-width: ${(i + 1) * width + margin}px) {
        width: ${100 / i}%;
      }
    `
  }
  return styles
}

const ListItem = styled.li`
  ${gridWidth(200, 8, 98)}
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
`

const ImageRatio = styled.div`
  position: relative;
  width: 100%;
  padding-top: 150%;
`

const imageShadow = ({ theme }) => `
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.25);
  transition-property: box-shadow;
  transition-duration: 250ms;
  transition-timing-function: ease-out;

  &:hover {
    box-shadow: 5px 5px 0 ${theme.color.lavender};
  }
`

const Image = styled.img`
  ${imageShadow}
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  object-fit: cover;
  object-position: center;
`

const Product = ({ product }) => (
  <ListItem>
    <ImageRatio>
      <Image src={`/static/images/product/${product.id}.jpg`} />
    </ImageRatio>
  </ListItem>
)

export default Product
