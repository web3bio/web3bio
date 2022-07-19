import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROFILES_ENS, GET_PROFILES_ETH, GET_PROFILES_TWITTER } from '../utils/queries'

export default function Search() {
  const [searchterm, setSearchterm] = useState('')
  const [searchResult, setSearchResult] = useState()
  const [searchFocus, setSearchFocus] = useState(false)

  const handleFocus = () => {
    setSearchFocus(true)
    console.log(searchFocus)
  }

  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchterm },
  })
  console.log(data)

  const handleSubmit = (e) => {
    setSearchterm(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div className={searchFocus?'focused':'inactive'}>
      <form autoComplete="off" role="search">
        <input
          type="text"
          placeholder="Search Twitter, ENS or Ethereum address"
          className='form-input input-lg'
          id='searchterm'
          onFocus={handleFocus}
        />
        <input className="d-none" type="submit" value="Submit"></input>
      </form>
    </div>
  )
}