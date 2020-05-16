import React, { Component } from "react";
import Instructions from "./Instructions.jsx";
import VideoIndexerDescriptionComponent from "./VideoIndexerDescriptionComponent.jsx";
import YouTube from "react-youtube";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";

class VideoIndexerDescription extends Component{
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      sceneIds: [],
      qnaData: [],
      sceneData: [],
      currentTime: 0,
      timer: 0,
      youtubeId: (props.location.query.id || "7QZNpS0uos4"),
    };

    //this.handleClick = this.handleClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.highlightScene = this.highlightScene.bind(this);
  }
  
  componentWillMount() {
    document.title = "Scenes";
    this.loadScenes();
  }

  // handleClick() {
  //   const sceneArr = [];
    
  //   this.state.sceneIds.forEach(sceneId => {
      
  //     const element = document.getElementById(sceneId);
  //     sceneArr.push({
  //       scene_id: element.getAttribute("id"),
  //       modified_description: element.getAttribute("description"),
  //       modified_ocr: element.getAttribute("ocr"),
  //       start_time: element.getAttribute("starttime"),
  //       end_time: element.getAttribute("endtime"),
  //       has_ai: true,
  //     });
  //   });
  //   console.log(sceneArr);
  //   const qnaData = this.state.qnaData;
  //   const elements = Array.prototype.slice.call(document.getElementsByName("humanQuestion")) || [];
  //   elements.forEach(element => {
  //     const sceneId = element.getAttribute("sceneid");
  //     if (!qnaData[sceneId]) {
  //       qnaData[sceneId] = [];
  //     }
  //     qnaData[sceneId].push({
  //       questionId: element.getAttribute("questionid"),
  //       answerId: element.getAttribute("answerid"),
  //       question: element.value,
  //       answer: "",
  //     });
  //   });
  //   console.log(qnaData);
    
    // https://docs.google.com/document/d/1hDX0ZGBW3VrEeNu71g1e2IitEu-FMtj_dYSiTJuXvVI/edit
    // const url = `http://18.221.192.73:5001/saveModifiedDescription`;
    // const optionObj = {
    //   method: "POST",
    //   body: JSON.stringify({
    //     user_id: "9fe1e2c6-5cd2-11ea-bc55-0242ac130003",
    //     videoId: "7QZNpS0uos4",
    //     scene_arr: sceneArr,
    //     qnaData: qnaData,
    //   }),
    // };
    // ourFetch(url, true, optionObj).then((response) => {
    //   console.log("response: " + response);
    // });
 // }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
 
  loadScenes() {
    const url = `http://18.221.192.73:5001/videoData?videoid=7QZNpS0uos4&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    ourFetch(url).then((response) => {
      const scenes = [];                    // create an empty array of scenes[]
      const sceneIds = [];
      const sceneData = [];
      let scene_num = 0;
      const items = response.modifiedData;
      const qnaList = [];                   // qnaList will be an array of arrays [[], [], [], ..., []]
      response.qnaList.forEach(item => {    // iterate every single item in qnaList
        if (!qnaList[item.sceneId]) {       // if qnaList[item.sceneId] does not exist, create an empty array [] for it
          qnaList[item.sceneId] = [];
        }
        qnaList[item.sceneId].push({        // push every single item into the correct bucket
          questionId: item.questionId,
          answerId: item.answerId,
          question: item.question,
          answer: item.answer,
        });
      });
      items.forEach(item => {               // iterate the modifiedData[]
        scene_num++;
        sceneIds.push(item.sc_id);
        sceneData.push({
          id: item.sc_id,
          startTime: item.start_time,
          endTime: item.end_time,
        });        
        scenes.push(
          <VideoIndexerDescriptionComponent
            key={item.sc_id}                // unique key required by react (can be a number or string)
            sceneId={item.sc_id}
            sceneNumber={item.sc_num}       // scene number (0 indexed)
            startTime={item.start_time}     // start time
            endTime={item.end_time}         // end time
            description={item.original_description}
            ocr={item.original_ocr}
            qnaList={qnaList[item.sc_id] || []}   // assign qnaList as a property of VideoIndexerComponent
            scene_num={scene_num}
          />
        );
      });
      this.setState({                       // assign the scenes[] to the constructor
        scenes: scenes,
        sceneIds: sceneIds,
        qnaData: qnaList,
        sceneData: sceneData,
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
    var prev = false;
    this.state.sceneData.forEach(item => {
      const isHighlighted = (currentTime >= item.startTime && currentTime < item.endTime);
      const sceneElement = document.getElementById(item.id);
      sceneElement.style.backgroundColor = isHighlighted ? "#AFEEEE" : "#FFFFFF";
    // sceneElement.style.position = isHighlighted ? "absolute": "relative";
     // sceneElement.scroll({top: 1000, left: 0, behavior: 'smooth' })
     // sceneElement.style.zIndex=isHighlighted ? 1: -1;
     // sceneElement.parentNode.appendChild(sceneElement);
      const progressBarElement = document.getElementById(item.id + "_progress_bar");
      progressBarElement.style.left = isHighlighted ? `${(currentTime - item.startTime) / (item.endTime - item.startTime) * 100}%` : 0;
    });
  }
  
  render() {
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
            <h5>Scene : 1  <br /><br /><b>0 - 40.541 (s)</b></h5>
            <h6>Dialogue Timeline: 20 (s)</h6>
            <div style ={{width: 700,  height: 50,  position: "relative",  background: "white", border: "2px solid gray"}}>
            <div style ={{width:250, height: 46, position:"absolute", backgroundColor: "blue" }}></div>  
            </div>
            <br />
            <h6>Description Timeline: 10 (s)</h6>
            <div style ={{width: 700,  height: 50,  position: "relative",  background: "white", border: "2px solid gray"}}>
            <div style ={{width:300, height: 46, position:"absolute", backgroundColor: "orange", marginInlineStart: 350  }}></div>  
            <div style ={{width:100, height: 46, position:"absolute", backgroundColor: "orange", marginInlineStart: 200  }}></div>  
            </div>
            <Button type="submit" style={{fontWeight:"bold", fontSize:14, padding: 12,marginLeft: 250 ,marginTop: 10,  marginRight: 25, marginBottom: 10}}  variant="info">Left</Button>
            <Button type="submit" style={{fontWeight:"bold", fontSize:14, padding: 12,marginLeft: 0 ,marginTop: 10,  marginRight: 25, marginBottom: 10}}  variant="info">Right</Button>
            


          </div>
          <div style={{marginLeft: "20px"}}>
            {/* render the scenes[] here */}
            {this.state.scenes}             
            <Button type="submit" onClick={this.handleClick}  style={{fontWeight:"bold", fontSize:16, padding: 15,marginLeft: 200 ,marginTop: 10, marginBlockStart: 25, marginBlockEnd: 25,  marginRight: 25, marginBottom: 10}} variant="success">Done!</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default VideoIndexerDescription;
