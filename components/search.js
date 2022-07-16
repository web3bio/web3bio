import React, { Component } from 'react'
import { getAvatarsByEns } from "../utils/NextAPI"

class Search extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { data } = await getAvatarsByEns('nykma.eth')
  }

  // async getIdByEns(ens) {
  //   try {
  //     const data = await client.query({
  //       query: GET_BY_ENS,
  //       variables: { id: ens },
  //     });
  //     console.log(data)
  //     return data
  //   } catch (e) {
  //     // this.setState({
  //     //   formLoading: false,
  //     //   pageToast: 'Something went wrong. Try again later.'
  //     // })
  //     throw e
  //   } finally {
  //     // this.setState({
  //     //   loading: false
  //     // })
  //   }
  // }

  


  // async setProfile(newRecords) {
  //   try {
  //     await window.contract.setRecordByOwner(newRecords)
  //   } catch (e) {
  //     this.setState({
  //       formLoading: false,
  //       pageToast: 'Something went wrong. Try again later.'
  //     })
  //     throw e
  //   }
  // }

  // handleChange(event) {

  //   switch (event.target.id) {
  //     case 'avatar':
  //       formAvatar = event.target.value
  //       break;
  //     case 'theme':
  //       formTheme = event.target.value
  //       break
  //   }

  //   this.setState({
  //     formChanged: true,
  //     formAvatar: formAvatar,
  //     formTheme: formTheme
  //   })
  // }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const { data: nft } = await getAvatarsByEns('nykma.eth');
      console.log(nft)
      return data
    } catch(e) {
      throw e
    }
  }

  render() {
    // const { 
    //   login,
    //   currentUser,
    //   loading,
    //   pageBio,
    //   pageStatus,
    //   formChanged,
    //   formLoading,
    //   formAvatar,
    //   formTheme,
    //   pageToast } = this.state

    return (
      <>
        <form onSubmit={this.handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Search Twitter, ENS or Ethereum address"
            className='form-input input-lg'
          />
        </form>
      </>
    )
  }

}

export default Search;