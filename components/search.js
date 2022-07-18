import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { GET_PROFILES_ENS } from '../utils/queries'

export default function Search() {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: 'nykma.eth' },
  })

  console.log(data)

  return (
    <>
      <form autoComplete="off">
        {/* {loading? <div className='loading'></div> : null} */}
        <input
          type="text"
          placeholder="Search Twitter, ENS or Ethereum address"
          className='form-input input-lg'
        />
      </form>
      {data?.nft.owner.displayName}
      <div></div>
    </>
  )
}