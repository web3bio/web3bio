import React from 'react'
import { gql, useQuery } from '@apollo/client'

const GET_PROFILES_ENS = gql`
  query {
    nft(chain: "ethereum", category: "ENS", id: "sujiyan.eth") {
      uuid
      owner {
        uuid
        platform
        identity
        displayName
      }
    }
  }
`;

export default function Search() {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS)

  console.log(data?.nft.owner.displayName)

  return (
    <>
      <form autoComplete="off">
        {loading? <div className='loading'></div> : null}
        <input
          type="text"
          placeholder="Search Twitter, ENS or Ethereum address"
          className='form-input input-lg'
        />
      </form>
      <div></div>
    </>
  )
}