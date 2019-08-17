import React from 'react'
import styled from 'styled-components'
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

const Header = styled.header`
  ${backgroundLavender}
  ${textWhite}
  position: fixed;
  left: 0;
  top: 0;
  padding: 5px 15px 15px 0;
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

const renderEmail = () => {
  const mailto = 'mailto:info@xianbridal.co.nz?subject=&body='
  return (
    <ContactItem>
      <Anchor
        href={mailto}
        icon="mail"
        text="info@xianbridal.co.nz"
      />
    </ContactItem>
  )
}

const renderPhone = () => (
  <ContactItem>
    <Anchor
      href="tel:098271286"
      icon="phone"
      itemProp="telephone"
      text="(09) 8271286"
    />
  </ContactItem>

)

const renderMobile = () => (
  <ContactItem>
    <Anchor
      href="tel:0211409204"
      icon="mobile"
      itemProp="telephone"
      text="(021) 1409204"
    />
  </ContactItem>
)

const renderAddress = () => (
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

const renderLocation = () => {
  const geolocation = '-36.908748,174.680093'
  const mapUrl = `http://maps.google.com?z=17&ll=${geolocation}&sll=${geolocation}&q=xian+bridal`
  return (
    <li>
      <Anchor
        href={mapUrl}
        icon="map"
        target="_blank"
      >
        {renderAddress()}
      </Anchor>
    </li>
  )
}

const BusinessCard = () => (
  <Header>
    <Name>
      {'Xian Bridal'}
    </Name>
    <Contact
      itemScope
      itemType="http://schema.org/Organization"
    >
      {renderNameData()}
      {renderLocationData()}
      {renderEmail()}
      {renderPhone()}
      {renderMobile()}
      {renderLocation()}
    </Contact>
  </Header>
)

export default BusinessCard
