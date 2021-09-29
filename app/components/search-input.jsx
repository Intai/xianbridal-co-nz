import React, { useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { LocationAction } from 'bdux-react-router'
import { borderOffLavender } from './color'

const Input = styled.input`
  ${borderOffLavender}
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  border-width: 3px 0 0 0;
  border-style: solid;
  box-sizing: border-box;
  outline: none;
  padding: 8px 15px 10px 40px;
  width: calc(100% - 3px);
  font-size: 60%;
  position: absolute;
  top: 25px;
  left: 13px;
`

const Image = styled.img`
  position: absolute;
  left: 20px;
  top: 34px;
  width: 26px;
`

const SearchInput = ({
  dispatch,
  isCompact,
  setIsSearching,
}) => {
  const inputRef = useRef()

  const handleKeyDown = useCallback((e) => {
    if (e.keyCode === 13) {
      const query = e.target.value.trim()
      if (query) {
        // press enter key to search by a query.
        dispatch(LocationAction.push(`/search/${query}`))
      }
      setIsSearching(false)
    } else if (e.keyCode === 27) {
      // press esc to cancel.
      setIsSearching(false)
    }
  }, [dispatch, setIsSearching])

  const handleBlur = useCallback(() => {
    // close the search text input.
    setIsSearching(false)
  }, [setIsSearching])

  useEffect(() => {
    const { current: input } = inputRef
    if (input) {
      input.focus()
    }
  }, [])

  return (
    <>
      <Input
        isCompact={isCompact}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        type="text"
      />
      <Image src={'/static/icons/search.svg'} />
    </>
  )
}

export default React.memo(SearchInput)
