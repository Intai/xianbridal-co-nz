import React from 'react'
import styled from 'styled-components'
import { textOffWhite, backgroundGrey } from './color'
import { fontSerif } from './typography'

const Container = styled.div`
  ${backgroundGrey}
  ${textOffWhite}
  ${fontSerif}
  padding: 10px 0;
  text-align: center;
`

const Footer = () => (
  <Container>
    {'Icons made by '}
    <a
      href="https://www.flaticon.com/authors/iconnice"
      title="Iconnice"
    >
      {'Iconnice'}
    </a>
    {' from '}
    <a
      href="https://www.flaticon.com/"
      title="Flaticon"
    >
      {'www.flaticon.com'}
    </a>
    {' is licensed by '}
    <a
      href="http://creativecommons.org/licenses/by/3.0/"
      rel="noopener noreferrer"
      target="_blank"
      title="Creative Commons BY 3.0"
    >
      {'CC 3.0 BY'}
    </a>
  </Container>
)

export default Footer
