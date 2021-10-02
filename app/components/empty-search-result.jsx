import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useBdux } from 'bdux'
import { LocationAction } from 'bdux-react-router'
import {
  textGrey,
  borderOffgrey,
  backgroundWhite,
} from './color'
import { getWebUrl } from '../utils/common-util'

const Container = styled.li`
  ${backgroundWhite}
  position: fixed;
  top: 200px;
  left: 50%;
  padding: 20px;
  margin: -50px 0 0 -150px;
  border-radius: 3px;
  padding: 20px;
  width: 300px;
`

const Title = styled.div`
  font-size: 150%;
`

const Question = styled.div`
  ${textGrey}
  margin-top: 20px;
  font-size: 130%;
`

const Answer = styled.div`
  margin-top: 5px;
  font-size: 110%;
`

const SearchContainer = styled.div`
  position: relative;
  margin-top: 10px;
`

const SearchInput = styled.input`
  ${borderOffgrey}
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  outline: none;
  padding: 8px 15px 10px 40px;
  width: 100%;
  font-size: 120%;
`

const SearchIcon = styled.img`
  position: absolute;
  left: 8px;
  top: 7px;
  width: 26px;
`

const Search = (props) => {
  const { dispatch } = useBdux(props)
  const inputRef = useRef()

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 13) {
      const query = e.target.value.trim()
      if (query) {
        // press enter key to search by a query.
        dispatch(LocationAction.push(`/search/${query}`))
      }
    }
  }, [dispatch])

  useEffect(() => {
    const { current: input } = inputRef
    if (input) {
      input.focus()
    }
  }, [])

  return (
    <SearchContainer>
      <SearchInput
        onKeyDown={handleKeyDown}
        ref={inputRef}
        type="text"
      />
      <SearchIcon
        src={getWebUrl('/static/icons/search.svg')}
      />
    </SearchContainer>
  )
}

const EmptySearchResult = () => {
  return (
    <Container>
      <Title>{'Sorry, we couldn\'t find a match'}</Title>
      <Question>{'Try another search?'}</Question>
      <Search />
      <Question>{'Need help finding something?'}</Question>
      <Answer>
        {'Call '}
        <a href="tel:0211409204">
          {'021-1409204'}
        </a>
        {' or '}
        <a href="mailto:info@xianbridal.co.nz?subject=&body=">
          {'Email us'}
        </a>
      </Answer>
    </Container>
  )
}

export default React.memo(EmptySearchResult)
