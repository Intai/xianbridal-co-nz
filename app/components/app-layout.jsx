import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import theme from './theme'
import Routes from './routes'
import Head from './head'
import Background from './background'
import BusinessCard from './business-card'
import Menu from './menu'
import Footer from './footer'

const Container = styled.div`
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  touch-callout: none;
  user-select: text;
`

const AppLayout = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <Routes />
      <Head />
      <Menu />
      <BusinessCard />
      <Background />
      <Footer />
    </Container>
  </ThemeProvider>
)

export default AppLayout
