import { keys, omit, pluck } from 'ramda'
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { createUseBdux } from 'bdux/hook'
import RootPortal from './root-portal'
import Anchor from './anchor'
import theme from './theme'
import { backgroundGrey, textOffWhite } from './color'
import { fontSerif, fontSans, fontShadow } from './typography'
import CatalogueStore from '../stores/catalogue-store'
import { canUseDOM, getImageUrl, encodeSku } from '../utils/common-util'
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

const ContainerForSeo = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`

const ImagesContainer = styled.div`
  ${backgroundGrey}
  position: absolute;
  overscroll-behavior: contain;
  overflow: auto;
  height: 100%;
  width: 100%;
  padding: 1px;
  box-sizing: border-box;
`

const Images = styled.div`
  white-space : nowrap;
  height: 100%;
  min-width: calc(100% + 1px);
`

const cleanImgProps = omit([
  'aspectRatio',
  'initialScale',
])

const ImageDom = (props) => {
  const refImage = useRef(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { current: image } = refImage
    if (image) {
      const { src, srcset } = image
      if (!srcset && !image.dataset.final) {
        image.onload = handleLoad
        image.src = src
      }
    }
  })

  return (
    <img
      {...cleanImgProps(props)}
      ref={refImage}
    />
  )
}

const Image = styled(ImageDom)`
  height: ${({ scale }) => scale * 100}%;
  min-height: ${({ initialScale }) => initialScale * 100}%;
  vertical-align: top;
  cursor: ${({ scale }) => (scale <= 1) ? 'zoom-in' : 'zoom-out'};
  aspect-ratio: ${({ aspectRatio }) => aspectRatio};
  display: inline-block;
`

const handleImageError = e => {
  const { target } = e

  if (target.src.indexOf('-200') >= 0) {
    target.src = target.src.replace('-200', '-500')
    target.srcset = ''
  } else if (target.src.indexOf('-1000') >= 0) {
    target.src = target.src.replace('-1000', '-500')
    target.srcset = ''
  } else if (target.src.indexOf('-2000') >= 0) {
    target.src = target.src.replace('-2000', '-1000')
    target.srcset = ''
  } else {
    target.style.display='none'
  }
  target.dataset.final = true
}

const handleLoad = e => {
  const { target } = e
  if (!target.srcset) {
    const { id, variation, widths, final } = target.dataset
    if (!final) {
      target.srcset = getSrcSet(id, variation, widths)
    }
  }
}

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

const getWidths = pluck(0)

const getMaxWidth = resolutions => {
  const resolution = resolutions[resolutions.length - 1]
  return resolution[0]
}

const getAspectRatio = resolutions => {
  const resolution = resolutions[0]
  return resolution[0] / resolution[1]
}

const getName = (product, variation) => {
  const suffix = variation ? `-${variation}` : ''
  return product.category === 'accessories'
    ? `Bridal Accessory #${encodeSku(product.id)}${suffix}`
    : `Wedding Dress #${encodeSku(product.id)}${suffix}`
}

const getCategory = (product) => (
  product.category === 'accessories'
    ? 'Apparel & Accessories > Clothing Accessories > Bridal Accessories'
    : 'Apparel & Accessories > Clothing > Wedding & Bridal Party Dresses > Wedding Dresses'
)

const getImage = (product, variation = '', width = 200) => getImageUrl(
  `/product/${product.id}${variation && `-${variation}`}-${width}.webp`,
)

const getSrcSet = (productId, variation = '', widths = '') => {
  const filename = `${productId}${variation && `-${variation}`}`
  return widths.split(',')
    .map(width => `${getImageUrl(`/product/${filename}-${width}.webp`)} ${width}w`)
    .join(', ')
}

const srcSizes = '\
(max-width: 500px) and (-webkit-device-pixel-ratio: 4) 250px, \
(max-width: 500px) and (-webkit-device-pixel-ratio: 3) 333px, \
(max-width: 500px) and (-webkit-device-pixel-ratio: 2) 500px, \
(max-width: 500px) 500px, \
2000px'

const setImageTempStyles = (refScroll, scale) => {
  const container = refScroll.current
  if (container) {
    container.querySelectorAll('img').forEach(img => {
      img.style.height = `${scale * 100}%`
      img.setAttribute('scale', scale)

      if (img.srcset) {
        img.src = img.dataset.src
        img.srcset = ''
        img.dataset.final = true
      }
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

const handleScale = (e, refScroll, setScale, refTouchPrev, initialScale) => {
  const { current: touchPrev } = refTouchPrev
  const attr = e.target.getAttribute('scale')
  const maxScale = Math.max(1, initialScale * IMAGE_HEIGHT / 2 / window.innerHeight)
  const scale = attr ? parseFloat(attr) : initialScale
  let focusX = 0
  let focusY = 0
  let nextScale = scale

  // mouse click to zoom in and out.
  if (e.type === 'click') {
    focusX = e.clientX
    focusY = e.clientY
    nextScale = (scale > (initialScale + maxScale) / 2)
      ? initialScale : maxScale
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
    nextScale = clamp(initialScale, maxScale, scale * currentDist / prevDist)
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
  initialScale,
  refScroll,
  scale,
  updateScale,
  updateTouchStart,
) => (
  <ImagesContainer ref={refScroll}>
    <Images onTouchStart={updateTouchStart}>
      <Image
        alt={getName(product)}
        aspectRatio={getAspectRatio(product.images[0])}
        content={getImage(product)}
        data-id={product.id}
        data-src={getImage(product, '', getMaxWidth(product.images[0]))}
        data-widths={getWidths(product.images[0])}
        importance="high"
        initialScale={initialScale}
        itemProp="image"
        onClick={updateScale}
        onError={handleImageError}
        onTouchMove={updateScale}
        scale={scale}
        src={getImage(product)}
        sizes={srcSizes}
      />
      {keys(product.images).slice(1).map(variation => (
        <Image
          alt={getName(product, variation)}
          aspectRatio={getAspectRatio(product.images[variation])}
          data-id={product.id}
          data-src={getImage(product, variation, getMaxWidth(product.images[variation]))}
          data-variation={variation}
          data-widths={getWidths(product.images[variation])}
          initialScale={initialScale}
          key={variation}
          onClick={updateScale}
          onError={handleImageError}
          onTouchMove={updateScale}
          scale={scale}
          src={getImage(product, variation)}
          sizes={srcSizes}
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

const getInitScale = ({ category }) => canUseDOM() && category === 'accessories'
  ? (window.innerWidth / (window.innerHeight * 2000 / 1333))
  : 1

const ProductDetails = ({
  product,
  backUrl,
}) => {
  const refScroll = useRef(null)
  const refTouchStart = useRef({})
  const initialScale = useMemo(() => getInitScale(product), [product])
  const [scale, setScale] = useState(initialScale)
  const updateScale = useCallback(e => handleScale(e, refScroll, setScale, refTouchStart, initialScale), [initialScale])
  const updateTouchStart = useCallback(e => handleTouchStart(e, refTouchStart), [])

  useEffect(() => {
    // clear dom manipulation from scaling.
    clearImageTempStyles(refScroll)
  })

  return (
    <>
      {renderImages(
        product,
        initialScale,
        refScroll,
        scale,
        updateScale,
        updateTouchStart,
      )}
      <Details>
        <Sku itemProp="identifier">
          {encodeSku(product.name || product.id)}
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
        href={backUrl || `/${product.category}`}
        icon="back"
      />
    </>
  )
}

const useBdux = createUseBdux({
  catalogue: CatalogueStore,
})

export const ProductDetailsForSeo = (props) => {
  const { state } = useBdux(props)
  const { catalogue } = state
  const product = catalogue && catalogue.selected

  return !!product && (
    <div id={`root-portal-${product.id}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1,
    }}>
      <ContainerForSeo
        itemScope
        itemType="http://data-vocabulary.org/Product"
      >
        <ThemeProvider theme={theme}>
          <ProductDetails
            product={product}
            backUrl="/"
          />
        </ThemeProvider>
      </ContainerForSeo>
    </div>
  )
}

const ProductDetailsWithPortal = (props) => (
  <ProductRootPortal
    id={`root-portal-${props.product.id}`}
    itemScope
    itemType="http://data-vocabulary.org/Product"
  >
    <ProductDetails {...props} />
  </ProductRootPortal>
)

export default ProductDetailsWithPortal
