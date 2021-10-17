import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'bdux-react-router'
import ProductDetails from './product-details'
import { textOffWhite } from './color'
import { fontSans, fontShadow } from './typography'
import { getImageUrl, encodeSku } from '../utils/common-util'
import { trackConversion } from '../utils/gtag-util'

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

const media = (firstQuery, funcStyle) => (props) => (
  funcStyle(props).replace(
    /@media\s*\(/gi,
    `@media (${firstQuery}) and (`,
  )
)

const ListItem = styled.li`
  ${media('orientation: landscape', gridWidth(200, 8, 83))}
  ${media('orientation: portrait', gridWidth(150, 8, 20))}
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

const getSrcSet = (productId) => `\
${getImageUrl(`/product/${productId}-500.webp`)} 2x, \
${getImageUrl(`/product/${productId}-500.webp`)} 3x, \
${getImageUrl(`/product/${productId}-500.webp`)} 4x`

const handleError = e => {
  const { target } = e
  target.src = getImageUrl(`/product/${target.dataset.id}-500.webp`)
  target.srcset = ''
}

const renderImage = ({ product }, refImage) => {
  const { id } = product
  return (
    <ImageRatio>
      <Image
        alt={`Wedding Dress Item#${id}`}
        data-id={id}
        onError={handleError}
        ref={refImage}
        src={getImageUrl(`/product/${id}-200.webp`)}
        srcSet={getSrcSet(id)}
      />
    </ImageRatio>
  )
}

const renderPrice = ({ product }) => {
  if (product.overlay) {
    return <Price>{product.overlay}</Price>
  } if (product.value && product.price) {
    return <Price>{`$${product.price}`}</Price>
  }
  return false
}

const renderSelected = ({ product, selected, backUrl }, boundingBox) => (
  selected && selected.id === product.id && (
    <ProductDetails
      initialRect={boundingBox}
      product={product}
      backUrl={backUrl}
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
  const { product, query } = props
  const refImage = useRef(null)
  const [boundingBox, setBoundingBox] = useState({})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const rect = refImage.current.getBoundingClientRect()
    if (!isEqualRect(boundingBox, rect)) {
      setBoundingBox(rect)
    }
  })

  return (
    <ListItem>
      <Link
        onMouseUp={trackConversion}
        to={query
          ? `/search/${query}/${encodeSku(product.id)}`
          : `/${product.category}/${encodeSku(product.id)}`}
      >
        {renderImage(props, refImage)}
        {renderPrice(props)}
      </Link>
      {renderSelected(props, boundingBox)}
    </ListItem>
  )
}

export default Product
