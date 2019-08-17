import { createUseBdux } from 'bdux'
import * as BusinessCardAction from '../actions/business-card-action'

const useBdux = createUseBdux({},
  BusinessCardAction.expand
)

const Home = (props) => {
  useBdux(props)
  console.log('home', )
  return null
}

export default Home
