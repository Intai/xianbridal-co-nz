import React from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux/hook'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Route,
} from 'bdux-react-router'
import Anchor from './anchor'
import {
  businessCardFullWidth,
  businessCardFullHeight,
} from './dimension'
import {
  fontTitle,
  fontLogo,
} from './typography'
import {
  textWhite,
  textOffLavender,
  backgroundLavender,
} from './color'

const headerDimension = (props) => {
  const { isCompact } = props

  if (isCompact) {
    return `
      width: 100%;
      height: 100%;
      max-width: 58px;
      max-height: 280px;

      @media (orientation: portrait), (max-width: 632px) {
        max-width: 290px;
        max-height: 56px;
      }
    `
  }
  return `
    width: 100%;
    height: 100%;
    max-width: ${businessCardFullWidth(props)};
    max-height: 190px;

    @media (max-width: ${businessCardFullWidth(props)}),
      (max-height: ${businessCardFullHeight(props)}) {
      max-width: 272px;
      max-height: 120px;
    }
  `
}

const headerPosition =({ isCompact }) => `
  position: ${isCompact ? 'fixed' : 'absolute'};
`

const Header = styled.header`
  ${backgroundLavender}
  ${textWhite}
  ${headerDimension}
  ${headerPosition}
  left: 0;
  top: 0;
  padding: 0 10px 10px 0;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  transition-property: max-width, max-height;
  transition-duration: 250ms;
  transition-timing-function: ease-out;

  @media (min-width: 589px) and (min-height: 620px),
    (min-width: 497px) and (min-height: 736px),
    (min-width: 298px) and (min-height: 780px),
    (max-width: 297px) and (min-height: 896px) {
    position: fixed;
  }
`

const Name = styled.h1`
  ${fontLogo}
  font-size: 225%;
  margin: 3px 0 5px 15px;
  padding: 0;
  min-height: 48px;
`

const Contact = styled.ul`
  ${fontTitle}
  ${textOffLavender}
  font-size: 120%;
  display: inline-block;
  vertical-align: bottom;
`

const ContactData = styled.li`
  display: none;
`

const ContactItem = styled.li`
  display: block;
  float: left;
`

const floatAddress = ({ isCompact }) => (
  isCompact ? 'left' : 'none'
)

const ContactAddressItem = styled.li`
  display: block;
  float: ${floatAddress};

  @media (max-width: ${businessCardFullWidth}),
    (max-height: ${businessCardFullHeight}) {
    float: left;
  }
`

const ContactItemData = styled.span`
  display: none;
`

const Address = styled.address`
  font-style: normal;
  display: inline-block;

  @media (max-width: ${businessCardFullWidth}),
    (max-height: ${businessCardFullHeight}) {
    display: none;
  }
`

const AddressHeading = styled.h2`
  text-decoration: underline;
`

const BackAnchor = styled(Anchor)`
  float: left;
`

const renderName = ({ isCompact }) => (
  !isCompact && (
    <Name>
      {'Xian Bridal'}
    </Name>
  )
)

const scrollToTop = () => {
  window.scrollTo(0, 0)
}

const renderBack = ({ isCompact }) => (
  !!isCompact && (
    <BackAnchor
      href="/"
      icon="back"
      onMouseUp={scrollToTop}
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

const renderEmail = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="mailto:info@xianbridal.co.nz?subject=&body="
      icon="mail"
      maxWidth={253}
      text={isCompact ? '' : 'info@xianbridal.co.nz'}
      title="info@xianbridal.co.nz"
    />
  </ContactItem>
)

const renderPhone = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="tel:098271286"
      icon="phone"
      itemProp="telephone"
      maxWidth={161}
      text={isCompact ? '' : '(09) 8271286'}
      title="(09) 8271286"
    />
  </ContactItem>

)

const renderMobile = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="tel:0211409204"
      icon="mobile"
      itemProp="telephone"
      maxWidth={163}
      text={isCompact ? '' : '021-1409204'}
      title="021-1409204"
    />
  </ContactItem>
)

const renderAddress = ({ isCompact }) => (
  !isCompact && (
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
        {'Open 10:15am to 4pm on Tue to Sat'}
      </div>
      <div>
        {'Temporarily closed during Covid 19 Level 3'}
        {/* 'Book an appointment for consultation' */}
      </div>
    </Address>
  )
)

const renderLocation = (props) => {
  const { isCompact } = props
  const geolocation = '-36.908748,174.680093'
  const mapUrl = `http://maps.google.com?z=17&ll=${geolocation}&sll=${geolocation}&q=xian+bridal`
  return (
    <ContactAddressItem isCompact={isCompact}>
      <Anchor
        href={mapUrl}
        icon="map"
        target="_blank"
        title="Shop 5 New Lynn Plaza, 3115 Great North Rd"
      >
        {renderAddress(props)}
      </Anchor>
    </ContactAddressItem>
  )
}

const useBdux = createUseBdux({
  location: LocationStore,
}, [
  // start listening to browser history.
  LocationAction.listen,
])

const BusinessCard = (props) => {
  const { match: { params: { category } } } = props
  const isCompact = !!category
  const data = { ...props, isCompact }

  return (
    <Header isCompact={isCompact}>
      {renderName(data)}
      {renderBack(data)}
      <Contact
        itemScope
        itemType="http://schema.org/Organization"
      >
        {renderNameData()}
        {renderLocationData()}
        {renderEmail(data)}
        {renderPhone(data)}
        {renderMobile(data)}
        {renderLocation(data)}
      </Contact>
    </Header>
  )
}

const BusinessCardRoutes = (props) => {
  const { state } = useBdux(props)
  const { location } = state

  return !!location && (
    <Router history={createLocationHistory(location)}>
      <Route
        component={BusinessCard}
        path="/:category?"
      />
    </Router>
  )
}

export default BusinessCardRoutes
