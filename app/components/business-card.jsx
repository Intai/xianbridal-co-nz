import React from 'react'
import styled from 'styled-components'
import { createUseBdux } from 'bdux'
import {
  createLocationHistory,
  LocationAction,
  LocationStore,
  Router,
  Switch,
  Route,
} from 'bdux-react-router'
import Anchor from './anchor'
import { smallWidth } from './device'
import {
  fontSans,
  fontLogo,
} from './typography'
import {
  textWhite,
  textOffLavender,
  backgroundLavender,
} from './color'

const headerWidth = ({ isCompact }) => `
  @media (orientation: landscape) {
    width: ${isCompact ? '58px' : 'auto'};
  }
`

const headerRight = (props) => `
  @media (orientation: portrait) and (max-width: ${smallWidth(props)}) {
    right: 0;
  }
`

const Header = styled.header`
  ${backgroundLavender}
  ${textWhite}
  ${headerWidth}
  ${headerRight}
  position: fixed;
  left: 0;
  top: 0;
  padding: 0 10px 10px 0;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
`

const Name = styled.h1`
  ${fontLogo}
  font-size: 225%;
  margin: 3px 0 5px 15px;
  padding: 0;
`

const Contact = styled.ul`
  ${fontSans}
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

  @media (max-width: ${smallWidth}) {
    float: left;
  }
`

const ContactItemData = styled.span`
  display: none;
`

const Address = styled.address`
  font-style: normal;
  display: inline-block;

  @media (max-width: ${smallWidth}) {
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

const renderBack = ({ isCompact }) => (
  !!isCompact && (
    <BackAnchor
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

const renderEmail = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="mailto:info@xianbridal.co.nz?subject=&body="
      icon="mail"
      text={isCompact ? '' : 'info@xianbridal.co.nz'}
    />
  </ContactItem>
  )

const renderPhone = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="tel:098271286"
      icon="phone"
      itemProp="telephone"
      text={isCompact ? '' : '(09) 8271286'}
    />
  </ContactItem>

)

const renderMobile = ({ isCompact }) => (
  <ContactItem>
    <Anchor
      href="tel:0211409204"
      icon="mobile"
      itemProp="telephone"
      text={isCompact ? '' : '(021) 1409204'}
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
        {'Open 11am to 3pm on Mon, 10am to 4pm on Tue to Sat'}
      </div>
      <div>
        {'Book an appointment for consultation'}
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
      >
        {renderAddress(props)}
      </Anchor>
    </ContactAddressItem>
  )
}

const useBdux = createUseBdux(
  { location: LocationStore },
  // start listening to browser history.
  LocationAction.listen
)

const BusinessCard = (props) => {
  const { isCompact } = props
  return (
    <Header isCompact={isCompact}>
      {renderName(props)}
      {renderBack(props)}
      <Contact
        itemScope
        itemType="http://schema.org/Organization"
      >
        {renderNameData()}
        {renderLocationData()}
        {renderEmail(props)}
        {renderPhone(props)}
        {renderMobile(props)}
        {renderLocation(props)}
      </Contact>
    </Header>
  )
}

const CompactBusinessCard = () => (
  BusinessCard({ isCompact: true })
)

const BusinessCardRoutes = (props) => {
  const { state } = useBdux(props)
  const { location } = state

  return !!location && (
    <Router history={createLocationHistory(location)}>
      <Switch>
        <Route
          component={CompactBusinessCard}
          path="/:category/:id?"
        />
        <Route
          component={BusinessCard}
          path="/"
        />
      </Switch>
    </Router>
  )
}

export default BusinessCardRoutes
