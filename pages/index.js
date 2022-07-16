import Head from 'next/head'
import Search from '../components/search'

export default function Home({ nft }) {
  return (
    <div>
      <Head>
        <title>Web5.bio</title>
        <meta name="description" content="Web5.bio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='web3bio-container'>
        <div className="web3bio-cover creamwhisper"></div>
        <div className="web3bio-hero">
          <div className="container grid-sm">
            <div className="columns">
              <div className="column col-12">
                <Search />
                {/* <h2>{nft?.owner.displayName}</h2>
                {nft?.owner.neighbor.map((identity) => (
                  <div key={identity.uuid}>
                    <span>{identity.platform} - {identity.displayName}</span>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}