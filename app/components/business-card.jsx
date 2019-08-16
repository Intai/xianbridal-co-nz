import React from 'react'
import styled from 'styled-components'
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
`

const Name = styled.h1`
  ${fontLogo}
  font-size: 225%;
  margin: 5px 15px 10px;
  padding: 0;
`

const Contact = styled.ul`
  ${fontSans}
  ${textOffLavender}
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

const ContactAnchor = styled.a`
  line-height: 64px;
`

const Address = styled.address`
  font-style: normal;
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
      <a href={mailto} />
      <ContactAnchor href={mailto}>
        {'info@xianbridal.co.nz'}
      </ContactAnchor>
    </ContactItem>
  )
}

const renderPhone = () => (
  <ContactItem>
    <a href="tel:098271286" />
    <ContactAnchor
      href="tel:098271286"
      itemProp="telephone"
    >
      {'(09) 8271286'}
    </ContactAnchor>
  </ContactItem>

)

const renderMobile = () => (
  <ContactItem>
    <a href="tel:0211409204" />
    <ContactAnchor
      href="tel:0211409204"
      itemProp="telephone"
    >
      {'(021) 1409204'}
    </ContactAnchor>
  </ContactItem>
)

const renderAddress = () => (
  <Address
    itemProp="address"
    itemScope
    itemType="http://schema.org/PostalAddress"
  >
    <h2>
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
    </h2>
  </Address>
)

const renderLocation = () => {
  const geolocation = '-36.908748,174.680093'
  const mapUrl = `http://maps.google.com?z=17&ll=${geolocation}&sll=${geolocation}&q=xian+bridal`
  return (
    <ContactItem>
      <a
        href={mapUrl}
        rel="noreferrer noopener"
        target="_blank"
      />
      <ContactAnchor
        href="{{ mapUrl }}"
        target="_blank"
      >
        {renderAddress()}
      </ContactAnchor>
      <span>
        {'Open 11am to 3pm on Mon, 10am to 4pm on Tue to Sat,'}
      </span>
      <div>
        {'Book an appointment for consultation'}
      </div>
    </ContactItem>
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
