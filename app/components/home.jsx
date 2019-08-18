import { useMemo } from 'react'

const Home = (props) => {
  const { location } = props
  return useMemo(() => {
    console.log('home', props)
    return false
  }, [location])
}

export default Home
