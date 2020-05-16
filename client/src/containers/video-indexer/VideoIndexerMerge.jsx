import React, { Component } from "react";
import Instructions from "./Instructions.jsx";
import VideoIndexerComponent from "./VideoIndexerComponent.jsx";
import YouTube from "react-youtube";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
//import { findDOMNode } from ‘react-dom’;
import $ from "jquery";

class VideoIndexerMerge extends Component{
  constructor(props) {
    super(props);
    this.state = {
      sceneData: [],
      scene_num: 0,
      scenes: [],
      currentTime: 0,
      timer: 0,
      youtubeId: (props.location.query.id || "7QZNpS0uos4"),
    };
    this.onStateChange = this.onStateChange.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.highlightScene = this.highlightScene.bind(this);
  }

  componentWillMount() {
    document.title = "Scenes";
    this.loadScenes();
  }
  
  loadScenes() {
    const url = `http://18.221.192.73:5001/videoData?videoid=7QZNpS0uos4&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    ourFetch(url).then((response) => {
      const scenes = [];                    // create an empty array of scenes[]
      const sceneData = [];
      let scene_num = 0;
      const items = response.modifiedData;
      items.forEach(item => {               // iterate the modifiedData[]
        scene_num++;
        //console.log("Hello"+scene_num);
        sceneData.push({
          id: item.sc_id,
          startTime: item.start_time,
          endTime: item.end_time,
        });
        scenes.push(
          <VideoIndexerComponent
            id={item.sc_id}
            key={item.sc_id}                // unique key required by react (can be a number or string)
            sceneNumber={item.sc_num}       // scene number (0 indexed)
            startTime={item.start_time}     // start time
            endTime={item.end_time}         // end time
            originalDescription={item.original_description}
            ocr={item.original_ocr}
            scene_num={scene_num}
          />
        );
        
      });
      this.setState({
        scenes: scenes,
        sceneData: sceneData,
        scene_num: scene_num
      });
    });
  }

  onPlay(event) {
    const currentTime = event.target.getCurrentTime();
    this.setState({
      currentTime: currentTime,
      timer: setInterval(this.updateTime, 100),
    });
  }

  onStateChange(event) {
    const currentTime = event.target.getCurrentTime();
    switch (event.data) {
      case YT.PlayerState.PLAYING:
      case YT.PlayerState.CUED:
      case YT.PlayerState.PAUSED:
        this.updateTime(currentTime);
        clearInterval(this.state.timer);
        break;
      case YT.PlayerState.UNSTARTED:
      case YT.PlayerState.BUFFERING:
      case YT.PlayerState.ENDED:
      default:
        break;
    }
  }

  updateTime() {
    const currentTime = this.state.currentTime + 0.1; 
    this.highlightScene(currentTime);
    this.setState({
      currentTime: currentTime,
    });
    // console.log(this.state.currentTime);
  }

  highlightScene(currentTime) {
    this.state.sceneData.forEach(item => {
      const isHighlighted = (currentTime >= item.startTime && currentTime < item.endTime);
      const sceneElement = document.getElementById(item.id);
      
    //   sceneElement.style.position = isHighlighted ? "absolute": "relative";
    //   if(isHighlighted == true){
    //   $(item.div).animate({top: '0px'});
    //  console.log({isHighlighted});
    //   }
      sceneElement.style.backgroundColor = isHighlighted ? "#AFEEEE" : "#FFFFFF";
      
      // sceneElement.style.top = isHighlighted ? 1000: 2000 ;
      // var el = sceneElement.nextElementSibling.innerHTML;
      // console.log('Siblings of div-01:');
      // console.log({el});
      const progressBarElement = document.getElementById(item.id + "_progress_bar");
      progressBarElement.style.left = isHighlighted ? `${(currentTime - item.startTime) / (item.endTime - item.startTime) * 100}%` : 0;
    });
  }

  render() {
    // https://developers.google.com/youtube/player_parameters
    const opts = {
      height: "400",
      width: "700",
      playerVars: {
        autoplay: 0,
        enablejsapi: 1,
        cc_load_policy: 1,
        controls: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        wmode: "opaque",
      },
    };
    return (
      <div>
        <header>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        </header>
        <Instructions/>
        <div style={{display: "flex", padding: 10, border: "1px solid gray", marginBlockStart: 50, marginBlockEnd: 50}}>
          <div>
            <YouTube
              videoId={this.state.youtubeId}
              opts={opts}
              onStateChange={(event) => this.onStateChange(event)}
              onPlay={(event) => this.onPlay(event)}
            />
            <hr/>
            {/* <h5><b>Create Notes </b></h5>
            <div>
            <form> 
                <label>
                  <b>Scene 1</b>
                <textarea name="notes" style={{ display: "flex",padding: 10, border: "2px solid gray", marginBlockStart: 30, marginBlockEnd: 25, width: 500, height: 100}}/>
                </label>
                <Button type="submit" style={{fontWeight:"bold", fontSize:14, padding: 12,marginLeft: 200 ,marginTop: 10,  marginRight: 25, marginBottom: 10}}  variant="success">Save</Button>
              </form>
            </div> */}
                

          </div>
          <div style={{marginLeft: "20px"}}>
            {this.state.scenes}
            <Button type="submit" style={{fontWeight:"bold", fontSize:16, padding: 15,marginLeft: 200 ,marginTop: 10, marginBlockStart: 25, marginBlockEnd: 25,  marginRight: 25, marginBottom: 10}} variant="success">Done Merging!</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default VideoIndexerMerge;
