import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'bdux-react-router'
import ProductDetails from './product-details'
import { textOffWhite } from './color'
import { fontSans, fontShadow } from './typography'
import { getImageUrl, encodeSku } from '../utils/common-util'
import { trackConversion } from '../utils/gtag-util'

const gridWidth = (width, count, margin) => () => {
  let styles = `
    @media (min-width: ${(count + 1) * width + margin}px) {
      width: ${100 / count}%;
    }
  `
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
  ${media('orientation: landscape', gridWidth(200, 20, 83))}
  ${media('orientation: portrait', gridWidth(150, 20, 20))}
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

const ImageDom = (props, ref) => (
  <img
    {...props}
    ref={ref}
  />
)

const Image = styled(React.forwardRef(ImageDom))`
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
${getImageUrl(`/product/${productId}-1000.webp`)} 1000w, \
${getImageUrl(`/product/${productId}-500.webp`)} 500w, \
${getImageUrl(`/product/${productId}-200.webp`)} 200w`

const srcSizes = '\
(max-width: 500px) and (-webkit-device-pixel-ratio: 4) 50px, \
(max-width: 500px) and (-webkit-device-pixel-ratio: 3) 66px, \
(max-width: 500px) and (-webkit-device-pixel-ratio: 2) 100px, \
(max-width: 500px) 100px, \
200px'

const handleError = e => {
  const { target } = e
  target.src = getImageUrl(`/product/${target.dataset.id}-500.webp`)
  target.srcset = ''
}

const handleLoad = e => {
  const { target } = e
  if (!target.srcset) {
    target.srcset = getSrcSet(target.dataset.id)
  }
}

const renderImage = ({ product, importance }, refImage) => {
  const { id } = product
  return (
    <ImageRatio>
      <Image
        alt={`Wedding Dress Item#${id}`}
        data-id={id}
        importance={importance}
        onError={handleError}
        ref={refImage}
        src={getImageUrl(`/product/${id}-200.webp`)}
        sizes={srcSizes}
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

const renderSelected = ({ product, selected, backUrl }) => (
  selected && selected.id === product.id && (
    <ProductDetails
      product={product}
      backUrl={backUrl}
    />
  )
)

const Product = (props) => {
  const { product, query } = props
  const refImage = useRef(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: image } = refImage
    if (image) {
      const { src, srcset } = image
      if (!srcset) {
        image.onload = handleLoad
        image.src = src
      }
    }
  })

  return (
    <ListItem>
      <Link
        as="a"
        onMouseUp={trackConversion}
        to={query
          ? `/search/${query}/${encodeSku(product.id)}`
          : `/${product.category}/${encodeSku(product.id)}`}
      >
        {renderImage(props, refImage)}
        {renderPrice(props)}
      </Link>
      {renderSelected(props)}
    </ListItem>
  )
}

export default Product
