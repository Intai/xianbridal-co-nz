import { useMemo } from 'react'

const Product = (props) => {
  const { location } = props
  return useMemo(() => {
    console.log('product', props)
    return false
  }, [location])
}

export default Product
