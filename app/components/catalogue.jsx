import { useMemo } from 'react'

const Catalogue = (props) => {
  const { location } = props
  return useMemo(() => {
    console.log('catalogue', props)
    return false
  }, [location])
}

export default Catalogue
