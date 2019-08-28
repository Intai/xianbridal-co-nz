import React, { useMemo } from 'react'
import styled from 'styled-components'

const EmptySpace = styled.div`
  height: 100vh;
`

const Home = () => (
  useMemo(() => <EmptySpace />, [])
)

export default Home
