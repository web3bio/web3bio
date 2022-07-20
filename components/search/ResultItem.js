import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'
import SVG from 'react-inlinesvg'
import IconTwitter from '../../assets/icons/icon-twitter.svg'

class ResultItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { social } = this.props

    return (
      <div className="profile-social profile-widget">
        { !!social.website? 
          <a href={social.website} target="_blank" rel="noopener noreferrer" className="profile-social-item tooltip website" title="Website">
            <SVG src={IconTwitter} className="profile-social-icon icon" />
          </a> : null
        }
      </div>
    )
  }

}

export default ResultItem;
