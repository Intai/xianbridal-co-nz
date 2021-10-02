import { once } from 'ramda'
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import styled from 'styled-components'
import RootPortal from './root-portal'
import Anchor from './anchor'
import { textOffWhite } from './color'
import { fontSerif, fontSans, fontShadow } from './typography'
import { getImageUrl } from '../utils/common-util'
import {
  getTouchDistance,
  getTouchCentre,
  clamp,
} from '../utils/math-util'

const IMAGE_HEIGHT = 4358

const ProductRootPortal = styled(RootPortal)`
  position: fixed;
  width: 100%;
  height: 100%;
`

const ImagesContainer = styled.div`
  background: rgba(0, 0, 0, 0.75);
  position: absolute;
  overscroll-behavior: contain;
  overflow: auto;
  height: 100%;
  width: 100%;
`

const Images = styled.div`
  text-align: center;
  white-space : nowrap;
  height: 100%;
  min-width: calc(100% + 1px);
`

const Image = styled.img`
  height: ${({ scale }) => scale * 100}%;
  vertical-align: top;
  cursor: ${({ scale }) => (scale <= 1) ? 'zoom-in' : 'zoom-out'};
`

const handleImageError = e => {
  const { target } = e
  if (target.src.indexOf('-1000') >= 0) {
    target.src = target.src.replace('-1000', '-500')
    target.srcset = ''
  } else if (target.src.indexOf('-2000') >= 0) {
    target.src = target.src.replace('-2000', '-1000')
    target.srcset = ''
  } else {
    target.style.display='none'
  }
}

const OptionalImage = ({ onClick, onTouchMove, scale, src }) => (
  <Image
    onClick={onClick}
    onError={handleImageError}
    onTouchMove={onTouchMove}
    scale={scale}
    src={src}
  />
)

const Details = styled.div`
  position: absolute;
  bottom: 25px;
  left: 25px;
`

const DetailsData = styled.span`
  display: none;
`

const Sku = styled.div`
  ${fontSans}
  ${fontShadow}
  ${textOffWhite}
  font-size: 125%;
`

const Offer = styled.div`
  ${fontSans}
  ${fontShadow}
  ${textOffWhite}
  font-size: 125%;
`

const Price = styled.span`
  margin-left: 10px;
`

const Value = styled.span`
  text-decoration: line-through;
  margin-left: 10px;
`

const Description = styled.div`
  ${fontSerif}
  ${fontShadow}
  ${textOffWhite}
  margin-top: 10px;
`

const getName = (product) => (
  product.category === 'accessories'
    ? `Bridal Accessory #${product.id}`
    : `Wedding Dress #${product.id}`
)

const getCategory = (product) => (
  product.category === 'accessories'
    ? 'Apparel & Accessories > Clothing Accessories > Bridal Accessories'
    : 'Apparel & Accessories > Clothing > Wedding & Bridal Party Dresses > Wedding Dresses'
)

const getImage = (product, variation = '') => getImageUrl(
  `/product/${product.id}${variation && `-${variation}`}-2000.jpg`,
)

const getSrcSet = (product, variation = '') => {
  const filename = `${product.id}${variation && `-${variation}`}`
  return `${getImageUrl(`/product/${filename}-1000.jpg`)} 1000w, \
${getImageUrl(`/product/${filename}-2000.jpg`)} 2000w`
}

const getSizes = once(() => window.devicePixelRatio === 2
  ? '(max-width: 500px) 500px, 1000px'
  : '(max-width: 1000px) 1000px, 2000px',
)

const setImageTempStyles = (refScroll, scale) => {
  const container = refScroll.current
  if (container) {
    container.querySelectorAll('img').forEach(img => {
      img.style.height = `${scale * 100}%`
      img.setAttribute('scale', scale)
    })
  }
}

const clearImageTempStyles = (refScroll) => {
  const container = refScroll.current
  if (container) {
    container.querySelectorAll('img').forEach(img => {
      img.style.height = ''
    })
  }
}

const scrollToScale = (refScroll, x, y, scale, nextScale) => {
  const container = refScroll.current
  if (container) {
    const top = container.scrollTop + y
    const left = container.scrollLeft + x
    const scrollTop = top * nextScale / scale - y
    const scrollLeft = left * nextScale / scale - x
    container.scrollTo(scrollLeft, scrollTop)
  }
}

const handleScale = (e, refScroll, setScale, refTouchPrev) => {
  const { current: touchPrev } = refTouchPrev
  const attr = e.target.getAttribute('scale')
  const maxScale = IMAGE_HEIGHT / 2 / window.innerHeight
  const scale = attr ? parseFloat(attr) : 1
  let focusX = 0
  let focusY = 0
  let nextScale = scale

  // mouse click to zoom in and out.
  if (e.type === 'click') {
    focusX = e.clientX
    focusY = e.clientY
    nextScale = (scale <= 1) ? maxScale : 1
  }
  // pinch to zoom.
  else if (e.type === 'touchmove'
    && touchPrev.touches.length >= 2
    && e.touches.length >= 2) {
    const prevDist = getTouchDistance(touchPrev.touches)
    const currentDist = getTouchDistance(e.touches)
    const centre = getTouchCentre(e.touches)
    focusX = centre.x
    focusY = centre.y
    nextScale = clamp(1, maxScale, scale * currentDist / prevDist)
    touchPrev.touches = e.touches
  }
  else {
    // no need to scale if not pinching.
    return
  }

  // when zoomming in.
  if (nextScale > scale) {
    // scale up the image immediately with dom manipulation,
    // so can scroll synchronously without flashes.
    setImageTempStyles(refScroll, nextScale)
  }
  // scroll to centre at the focus point.
  scrollToScale(refScroll, focusX, focusY, scale, nextScale)
  // re-render with the new scale.
  setScale(nextScale)
}

const handleTouchStart = (e, refTouchPrev) => {
  const { current: touchPrev } = refTouchPrev
  touchPrev.touches = e.touches
}

const renderImages = (
  product,
  initialRect,
  refScroll,
  scale,
  updateScale,
  updateTouchStart,
) => (
  <ImagesContainer ref={refScroll}>
    <Images onTouchStart={updateTouchStart}>
      <Image
        alt={getName(product)}
        content={getImage(product)}
        initialRect={initialRect}
        itemProp="image"
        onClick={updateScale}
        onError={handleImageError}
        onTouchMove={updateScale}
        scale={scale}
        src={getImage(product)}
        srcSet={getSrcSet(product)}
        sizes={getSizes()}
      />
      {[1, 2, 3, 4].map(variation => (
        <OptionalImage
          key={variation}
          onClick={updateScale}
          onTouchMove={updateScale}
          scale={scale}
          src={getImage(product, variation)}
          srcSet={getSrcSet(product, variation)}
          sizes={getSizes()}
        />
      ))}
    </Images>
  </ImagesContainer>
)

const renderOffer = (product) => (
  !!product.price && (
    <Offer
      itemProp="offerDetails"
      itemScope
      itemType="http://schema.org/Offer"
    >
      <Price
        content={product.price}
        itemProp="price"
      >
        {`$${product.price}`}
      </Price>
      {!!product.value && (
        <Value>
          {`$${product.value}`}
        </Value>
      )}
      <DetailsData
        content="NZD"
        itemProp="priceCurrency"
      />
    </Offer>
  )
)

const ProductDetails = ({
  initialRect,
  product,
  query,
}) => {
  const refScroll = useRef(null)
  const refTouchStart = useRef({})
  const [scale, setScale] = useState(1)
  const updateScale = useCallback(e => handleScale(e, refScroll, setScale, refTouchStart), [])
  const updateTouchStart = useCallback(e => handleTouchStart(e, refTouchStart), [])

  useEffect(() => {
    // clear dom manipulation from scaling.
    clearImageTempStyles(refScroll)
  })

  return (
    <ProductRootPortal
      itemScope
      itemType="http://data-vocabulary.org/Product"
    >
      {renderImages(
        product,
        initialRect,
        refScroll,
        scale,
        updateScale,
        updateTouchStart,
      )}
      <Details>
        <Sku itemProp="identifier">
          {product.name || product.id}
        </Sku>
        {renderOffer(product)}
        <Description itemProp="description">
          {product.description}
        </Description>
        <DetailsData
          content={getName(product)}
          itemProp="name"
        />
        <DetailsData
          content={getCategory(product)}
          itemProp="category"
        />
      </Details>
      <Anchor
        href={query
          ? `/search/${query}`
          : `/${product.category}`}
        icon="back"
      />
    </ProductRootPortal>
  )
}

export default ProductDetails
