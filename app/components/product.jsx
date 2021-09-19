import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'bdux-react-router'
import ProductDetails from './product-details'
import { smallWidth, aboveSmallWidth } from './device'
import { textOffWhite } from './color'
import { fontSans, fontShadow } from './typography'

const gridWidth = (width, count, margin) => () => {
  let styles = ''
  for (let i = count; i > 0; --i) {
    styles = `${styles}
      @media (max-width: ${(i + 1) * width + margin - 1}px) {
        width: ${100 / i}%;
      }
    `
  }
  return styles
}

const media = (funcQuery, funcStyle) => (props) => (
  funcStyle(props).replace(
    /@media\s*\(/gi,
    `@media (${funcQuery(props)}) and (`,
  )
)

const aboveSmallScreen = props => (
  `min-width: ${aboveSmallWidth(props)}`
)

const smallScreen = props => (
  `max-width: ${smallWidth(props)}`
)

const ListItem = styled.li`
  ${media(aboveSmallScreen, gridWidth(200, 8, 98))}
  ${media(smallScreen, gridWidth(160, 8, 0))}
  position: relative;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  padding: 0 20px 20px 0;
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

const ImageRatio = styled.div`
  ${imageShadow}
  position: relative;
  width: 100%;
  padding-top: 150%;
  overflow: hidden;
`

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition-property: transform;
  transition-duration: 250ms;
  transition-timing-function: ease-out;

  &:hover {
    transform: translate(2px, 2px);
  }
`

const Price = styled.div`
  ${fontSans}
  ${fontShadow}
  ${textOffWhite}
  position: absolute;
  bottom: 25px;
  left: 10px;
`

const renderImage = ({ product }, refImage) => (
  <ImageRatio>
    <Image
      alt={`Wedding Dress Item#${product.id}`}
      ref={refImage}
      src={`/static/images/product/${product.id}.jpg`}
    />
  </ImageRatio>
)

const renderPrice = ({ product }) => (
  product.value && product.price && (
    <Price>
      {`$${product.price}`}
    </Price>
  )
)

const renderSelected = ({ product, selected }, boundingBox) => (
  selected && selected.id === product.id && (
    <ProductDetails
      initialRect={boundingBox}
      product={product}
    />
  )
)

const isEqualFloat = (a, b) => (
  Math.abs(a - b) < 1
)

const isEqualRect = (a, b) => (
  isEqualFloat(a.top, b.top)
    && isEqualFloat(a.left, b.left)
    && isEqualFloat(a.height, b.height)
    && isEqualFloat(a.width, b.width)
)

const Product = (props) => {
  const { product } = props
  const refImage = useRef(null)
  const [boundingBox, setBoundingBox] = useState({})

  useEffect(() => {
    const rect = refImage.current.getBoundingClientRect()
    if (!isEqualRect(boundingBox, rect)) {
      setBoundingBox(rect)
    }
  })

  return (
    <ListItem>
      <Link to={`/${product.category}/${product.id}`}>
        {renderImage(props, refImage)}
        {renderPrice(props)}
      </Link>
      {renderSelected(props, boundingBox)}
    </ListItem>
  )
}

export default Product
