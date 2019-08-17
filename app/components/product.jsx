import { createUseBdux } from 'bdux'
import * as BusinessCardAction from '../actions/business-card-action'

const useBdux = createUseBdux({},
  BusinessCardAction.shrink
)

const Product = (props) => {
  useBdux(props)
  console.log('product', )
  return null
}

export default Product
