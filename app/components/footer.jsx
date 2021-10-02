import React from 'react'
import styled from 'styled-components'
import { textOffWhite, backgroundGrey } from './color'
import { fontSerif } from './typography'

const Container = styled.footer`
  ${backgroundGrey}
  ${textOffWhite}
  ${fontSerif}
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  text-align: left;
`

const Section = styled.section`
  flex: 0 0 auto;
`

const Title = styled.div`
  font-size: 150%;
  margin-bottom: 20px;
`

const Line = styled.div`
  font-size: 100%;
`

const LineBreak = styled(Line)`
  margin-bottom: 10px;
`

const Anchor = styled.a`
  display: block;
`

const Footer = () => (
  <Container>
    <Section>
      <Title>{'Opening Hours'}</Title>
      <Line>{'Mon Closed'}</Line>
      <Line>{'Tue-Sat 10:15am - 4pm'}</Line>
      <Line>{'Sunday & Public Holidays Closed'}</Line>
      <Line>{'Book an appointment for consultation'}</Line>
    </Section>
    <Section>
      <Title>{'Contact'}</Title>
      <Line>{'info@xianbridal.co.nz'}</Line>
      <LineBreak>{'021-1409204'}</LineBreak>
      <Line>{'Shop 5 New Lynn Plaza'}</Line>
      <Line>{'3115 Great North Rd'}</Line>
      <Line>{'New Lynn'}</Line>
      <Line>{'Auckland'}</Line>
    </Section>
    <Section>
      <Title>{'Social'}</Title>
      <Anchor
        href="https://www.facebook.com/xianbridal"
        rel="noreferrer"
        target="_blank"
      >
        {'Facebook'}
      </Anchor>
      <Anchor
        href="https://www.instagram.com/xianbridal"
        rel="noreferrer"
        target="_blank"
      >
        {'Instagram'}
      </Anchor>
    </Section>
  </Container>
)

export default Footer
