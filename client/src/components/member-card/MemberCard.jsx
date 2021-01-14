import React, {Component} from 'react';
import path from 'path';

class MemberCard extends Component{

    constructor(props){
        super(props)
      }
    
    render(){
    return(
    <div>
        <div id="video-card" className="w3-margin-top w3-left" title="">
        <div className="w3-card-2 w3-hover-shadow">
          <div id="card-thumbnail" aria-hidden="true">
            <img alt={this.props.desc} src={path.join(__dirname, 'assets', 'img', 'creditPage',`${this.props.img}`)} width="80%" height="150px" style={{ display:"block", marginLeft:"auto", marginRight:"auto" }}/>
          </div>
          <div className="w3-container w3-padding-bottom">
            <div id="card-title-container">
              <div id="card-title">
                <h2 style={{ height:"auto", width:"auto" }}>{this.props.name}</h2>
              </div>
              <div id="card-bio" style={{ overflow:"hidden" }}>
                <span style={{whiteSpace:"nowrap", textOverflow:"ellipsis", background:"white"}}>{this.props.designation}</span>
                <span style={{whiteSpace:"nowrap", textOverflow:"ellipsis", background:"white"}}>{this.props.tenure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
    }
}

export default MemberCard;