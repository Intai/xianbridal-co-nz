import React from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux'
import BusinessCardStore from '../stores/business-card-store'
import Anchor from './anchor'
import {
  fontSans,
  fontLogo,
} from './typography'
import {
  textWhite,
  textOffLavender,
  backgroundLavender,
} from './color'

const headerWidth = ({ card }) => `
  width: ${card.isCompact ? '58px' : 'auto'};
`

const Header = styled.header`
  ${backgroundLavender}
  ${textWhite}
  ${headerWidth}
  position: fixed;
  left: 0;
  top: 0;
  padding: 5px 10px 10px 0;
`

const Name = styled.h1`
  ${fontLogo}
  font-size: 225%;
  margin: 0 0 10px 15px;
  padding: 0;
`

const Contact = styled.ul`
  ${fontSans}
  ${textOffLavender}
  font-size: 120%;
`

const ContactData = styled.li`
  display: none;
`

const ContactItem = styled.li`
  display: block;
  float: left;
`

const ContactItemData = styled.span`
  display: none;
`

const Address = styled.address`
  font-style: normal;
  display: inline-block;
`

const AddressHeading = styled.h2`
  text-decoration: underline;
`

const renderName = (card) => (
  !card.isCompact && (
    <Name>
      {'Xian Bridal'}
    </Name>
  )
)

const renderBack = (card) => (
  !!card.isCompact && (
    <Anchor
      href="/"
      icon="back"
    />
  )
)

const renderNameData = () => (
  <ContactData itemProp="name">
    {'Xian Bridal'}
  </ContactData>
)

const renderLocationData = () => (
  <ContactData
    itemProp="location"
    itemScope
    itemType="http://schema.org/Place"
  >
    <div
      itemProp="geo"
      itemScope
      itemType="http://schema.org/GeoCoordinates"
    >
      <span
        content="-36.908748"
        property="latitude"
      />
      <span
        content="174.680093"
        property="longitude"
      />
    </div>
  </ContactData>
)

const renderEmail = (card) => (
  <ContactItem>
    <Anchor
      href="mailto:info@xianbridal.co.nz?subject=&body="
      icon="mail"
      text={card.isCompact ? '' : 'info@xianbridal.co.nz'}
    />
  </ContactItem>
  )

const renderPhone = (card) => (
  <ContactItem>
    <Anchor
      href="tel:098271286"
      icon="phone"
      itemProp="telephone"
      text={card.isCompact ? '' : '(09) 8271286'}
    />
  </ContactItem>

)

const renderMobile = (card) => (
  <ContactItem>
    <Anchor
      href="tel:0211409204"
      icon="mobile"
      itemProp="telephone"
      text={card.isCompact ? '' : '(021) 1409204'}
    />
  </ContactItem>
)

const renderAddress = (card) => (
  !card.isCompact && (
    <Address
      itemProp="address"
      itemScope
      itemType="http://schema.org/PostalAddress"
    >
      <AddressHeading>
        <span itemProp="streetAddress">
          {'Shop 5 New Lynn Plaza'}
        </span>
        {', '}
        <span itemProp="streetAddress">
          {'3115 Great North Rd'}
        </span>
        {', '}
        <span itemProp="addressLocality">
          {'New Lynn'}
        </span>
        {', '}
        <span itemProp="addressRegion">
          {'Auckland'}
        </span>
        <ContactItemData itemProp="postalCode">
          {'0600'}
        </ContactItemData>
        <ContactItemData itemProp="addressCountry">
          {'New Zealand'}
        </ContactItemData>
      </AddressHeading>
      <div>
        {'Open 11am to 3pm on Mon, 10am to 4pm on Tue to Sat'}
      </div>
      <div>
        {'Book an appointment for consultation'}
      </div>
    </Address>
  )
)

const renderLocation = (card) => {
  const geolocation = '-36.908748,174.680093'
  const mapUrl = `http://maps.google.com?z=17&ll=${geolocation}&sll=${geolocation}&q=xian+bridal`
  return (
    <li>
      <Anchor
        href={mapUrl}
        icon="map"
        target="_blank"
      >
        {renderAddress(card)}
      </Anchor>
    </li>
  )
}

const useBdux = createUseBdux({
  card: BusinessCardStore
})

const BusinessCard = (props) => {
  const { state } = useBdux(props)
  const { card } = state

  return !!card && (
    <Header card={card}>
      {renderName(card)}
      {renderBack(card)}
      <Contact
        itemScope
        itemType="http://schema.org/Organization"
      >
        {renderNameData()}
        {renderLocationData()}
        {renderEmail(card)}
        {renderPhone(card)}
        {renderMobile(card)}
        {renderLocation(card)}
      </Contact>
    </Header>
  )
}

export default BusinessCard
