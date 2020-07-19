import React, { Component } from "react";
import Instructions from "./Instructions.jsx";
import VideoIndexerDescriptionComponent from "./VideoIndexerDescriptionComponent.jsx";
import YouTube from "react-youtube";
import Draggable from "react-draggable";
import { Link } from "react-router";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetch, convertSecondsToEditorFormat } from "../../shared/helperFunctions";


class VideoIndexerDescription extends Component{
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      sceneIds: [],
      showHideNote: true,
      showHideTimeline: false,
      note:"",
      currentSceneId: "",
      currentSceneStartTime: 0,
      currentSceneEndTime: 0,
      currentTime: 0,
      currentSceneNumber: "",
      currentSceneNote: "",
      qnaData: [],
      sceneData: [],
      descriptionData: {},
      dialogueData: {},
      timer: 0,
      youtubeId: "",
      audioClipTime: 0,
      audioClipId: "",
      audioClipType: "",
      audioClipData: {},
      inlineAudioClipData: {},
    };

    this.totalTimeLength = 670;
    this.borderLength = 4;
    this.handleDrag = this.handleDrag.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.syncWithVideo = this.syncWithVideo.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.handleClickConvert = this.handleClickConvert.bind(this);
    this.callback = this.callback.bind(this);
  }
  
  componentWillMount() {
    document.title = "Scenes";
    this.loadDescriptions();
  }

  loadDescriptions() {
    const url = `http://18.221.192.73:5001/generateAudioDescriptionMp3?videoId=7QZNpS0uos4&volunteerId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    // const url = `http://18.221.192.73:5001/generateAudioDescriptionMp3?videoId=vBkBS4O3yvY&volunteerId=b38bc436-7b90-11ea-bc55-0242ac130003`;
    ourFetch(url).then((response) => {
      this.setState({
        descriptionData: response,
        youtubeId: (this.props.location.query.id || "7QZNpS0uos4"),
      }, () => {
        this.loadScenes();
      });
    });
  }

  loadScenes() {
    let obj = this;
    const url = `http://18.221.192.73:5001/videoData?videoid=7QZNpS0uos4&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    // const url = `http://18.221.192.73:5001/videoData?videoid=vBkBS4O3yvY&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    ourFetch(url).then((response) => {
      const scenes = [];
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
      items.forEach(item => {
        scene_num++;
        sceneIds.push(item.sc_id);
        sceneData.push({
          id: item.sc_id,
          startTime: item.start_time,
          endTime: item.end_time,
          extraTime: 0,
          sceneNumber: scene_num,
          note: item.note,
        });        
        scenes.push(
          <VideoIndexerDescriptionComponent
            key={item.sc_id}
            sceneId={item.sc_id}
            sceneNumber={item.sc_num}       // scene number (0 indexed)
            startTime={item.start_time}
            endTime={item.end_time}
            descriptions={this.state.descriptionData[item.sc_id]["sentences"]}
            ocr={item.original_ocr}
            qnaList={qnaList[item.sc_id] || []}
            scene_num={scene_num}
            note={item.note}
            indexerDescription={obj}
            youtubeId={this.state.youtubeId}
            callback={this.callback}
          />
        );
      });
      this.setState({
        scenes: scenes,
        sceneIds: sceneIds,
        qnaData: qnaList,
        sceneData: sceneData,
      });
    });
  }

  callback(sceneId, data) {
    const descriptionData = this.state.descriptionData;
    descriptionData[sceneId] = data;
    this.setState({
      descriptionData: descriptionData,
      currentSceneId: "",                         // update the current scene id to trigger the re-rendering
    }, () => {
      this.syncWithVideo(this.state.currentTime); // re-render the timeline blocks
    });
  }

  handleNoteChange(event) {
    this.setState({
      note: event.target.value,
    });
  }

  handleSaveNote(){
    const element = document.getElementById(this.state.currentSceneId);
    let currentScene = "";
    this.state.scenes.forEach(item => {
        if(this.state.currentSceneId === item.key){
            currentScene = item.props;
        }
    });
    let scene = {};
    scene.scene_id = currentScene.sceneId;
    scene.modified_description = currentScene.description;
    // scene.sceneNumber = currentScene.sceneNumber;
    scene.start_time = currentScene.startTime;
    scene.end_time = currentScene.endTime;
    scene.modified_ocr = currentScene.ocr;
    scene.note = this.state.note;
    scene.has_ai= true;
    const qnaData = [];
    console.log("abccd " + this.state.note);
    console.log(scene);
    let sceneArr = [];
    sceneArr.push(scene);
    const url = `http://18.221.192.73:5001/saveAiDescription`;
    const optionObj = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: "9fe1e2c6-5cd2-11ea-bc55-0242ac130003",
        videoId: "7QZNpS0uos4",
        scene_arr: sceneArr,
        qnaData: qnaData,
      }),
    };
    ourFetch(url, true, optionObj).then((response) => {
      console.log("response: " + JSON.stringify(response));
      console.log(
        {user_id: "9fe1e2c6-5cd2-11ea-bc55-0242ac130003",
        videoId: "7QZNpS0uos4",
        scene_arr: sceneArr,
        qnaData: qnaData
      });
    });
  }

  handlePlay(event) {
    const currentTime = event.target.getCurrentTime();
    this.setState({
      currentTime: currentTime,
      timer: setInterval(this.updateTime, 100),
    });
  }

  handleStateChange(event) {
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
    this.syncWithVideo(currentTime);
    this.syncWithAudio();
    this.setState({
      currentTime: currentTime,
    });
  }

  syncWithVideo(currentTime) {
    this.state.sceneData.forEach(item => {
      const isHighlighted = (currentTime >= item.startTime && currentTime < item.endTime);
      const sceneElement = document.getElementById(item.id);
      sceneElement.style.backgroundColor = isHighlighted ? "#AFEEEE" : "#FFFFFF";
      const progressBarElement = document.getElementById(item.id + "_progress_bar");
      progressBarElement.style.left = isHighlighted ? `${(currentTime - item.startTime) / (item.endTime - item.startTime) * 100}%` : 0;
      if (isHighlighted) {
        // scroll to the current scene
        document.getElementById("scroll_bar").scrollTo({top: sceneElement.offsetTop - 380, behavior: "smooth"});
        const unitLength = this.totalTimeLength / (item.endTime - item.startTime);

        // update dialogue timestamps
        const dialogueData = {};
        this.state.descriptionData["dialog timestamps"].forEach(interval => {
          if ((interval["start time"] >= item.startTime && interval["start time"] < item.endTime)
              || (interval["end time"] >= item.startTime && interval["end time"] < item.endTime)) {
            const x = Math.max(0, (interval["start time"] - item.startTime)) * unitLength;
            const width = Math.min(this.totalTimeLength - x - this.borderLength, (interval["end time"] - interval["start time"]) * unitLength);
            dialogueData[interval["start time"]] = {
              controlledPosition: {x: x, y: 0},
              width: width,
            };
          }
        });
        this.setState({
          dialogueData: dialogueData,
          currentSceneEndTime: item.endTime,
          currentSceneStartTime: item.startTime,
        });

        // update audio clip timestamps and note
        if (this.state.descriptionData[item.id] && this.state.currentSceneId != item.id) {
          const audioClipData = {};
          this.state.descriptionData[item.id].sentences.forEach(sentence => {
            if (sentence["audio type"] == "inline") {
              const x = (sentence["audio start time"] - item.startTime) * unitLength;
              const width = sentence["audio duration"] * unitLength;
              audioClipData[sentence["sentence id"]] = {
                type: "inline",
                controlledPosition: {x: x, y: 0},
                width: width,
                actualWidth: width,
              };
            } else {
              const x = Math.min(this.totalTimeLength - 1 - this.borderLength, (sentence["audio start time"] - item.startTime) * unitLength);
              const width = sentence["audio duration"] * unitLength;
              audioClipData[sentence["sentence id"]] = {
                type: "extended",
                controlledPosition: {x: x, y: -99},
                width: 5,
                actualWidth: width,
              };
            }
          });

          let sceneNumber = "";
          let note = "";
          
          this.state.sceneData.forEach(scene => {
            if (scene.id === item.id) {
              sceneNumber = scene.sceneNumber;
              note = scene.note;
            }
          });

          this.setState({
            audioClipData: audioClipData,
            currentSceneNumber: sceneNumber, 
            currentSceneNote: note,
            currentSceneId: item.id,
          });
        }
      }
    });
  }

  syncWithAudio(){
    console.log(this.state.descriptionData);
    this.state.sceneData.forEach(item => {
    if (this.state.descriptionData[item.id] && this.state.currentSceneId != item.id){
    const inlineAudioClipData = {};
    let extendedAudioClipMap = new Map();
    this.state.descriptionData[item.id].sentences.forEach(sentence => {
      if (sentence["audio type"] == "inline") {
        const audioStartTime = sentence["audio start time"];
        const audioDuration = sentence["audio duration"];
        const audioPath = sentence["url"];
        inlineAudioClipData[sentence["sentence id"]] = {
          type: "inline",
          audioStartTime: audioStartTime,
          audioDuration: audioDuration,
          audioPath: audioPath,
        };
        
      }else{
        if (extendedAudioClipMap.has(item.id)) {
          extendedAudioClipMap.get(item.id).push(sentence["url"]);
        } else {
          let extendedAudioClipList = [];
          extendedAudioClipMap.set(item.id, extendedAudioClipList);
          extendedAudioClipMap.get(item.id).push(sentence["url"]);
        }
      }
    }); 

    this.setState({
      inlineAudioClipData: inlineAudioClipData,
      extendedAudioClipMap: extendedAudioClipMap,
    });

    console.log(this.state.inlineAudioClipData);
    console.log(extendedAudioClipMap);
  }
});
  }

  handleStart(event, position) {
    const oldSentenceElement = document.getElementById(this.state.audioClipId + "_textarea");
    if (oldSentenceElement) {
      oldSentenceElement.style.color = "#000000";
    }
    const id = event.target.id;
    const newSentenceElement = document.getElementById(id + "_textarea");
    newSentenceElement.style.color = "#FFB74D";
    this.setState({
      audioClipTime: (this.state.currentSceneStartTime + position.x / this.totalTimeLength * (this.state.currentSceneEndTime - this.state.currentSceneStartTime)).toFixed(2),
      audioClipId: id,
      audioClipType: this.state.audioClipData[id].type,
    });
  }

  handleDrag(event, position) {
    let audioClipData = this.state.audioClipData;
    let descriptionData = this.state.descriptionData;
    const id = this.state.audioClipId;
    const startTime = (this.state.currentSceneStartTime + position.x / this.totalTimeLength * (this.state.currentSceneEndTime - this.state.currentSceneStartTime)).toFixed(2);
    audioClipData[id].controlledPosition = position;
    descriptionData[this.state.currentSceneId].sentences.forEach(sentence => {
      if (sentence["sentence id"] == id) {
        sentence["audio start time"] = startTime;
      }
    });
    this.setState({
      descriptionData: descriptionData,
      audioClipData: audioClipData,
      audioClipTime: startTime,
    });
  };

  handleLeftClick() {
    let audioClipData = this.state.audioClipData;
    let descriptionData = this.state.descriptionData;
    const id = this.state.audioClipId;
    const x = Math.max(0, audioClipData[id].controlledPosition.x - 10);
    const startTime = (this.state.currentSceneStartTime + x / this.totalTimeLength * (this.state.currentSceneEndTime - this.state.currentSceneStartTime)).toFixed(2);
    audioClipData[id].controlledPosition.x = x; 
    descriptionData[this.state.currentSceneId].sentences.forEach(sentence => {
      if (sentence["sentence id"] == id) {
        sentence["audio start time"] = startTime;
      }
    });
    this.setState({
      descriptionData: descriptionData,
      audioClipData: audioClipData,
      audioClipTime: startTime,
    });
  }

  handleRightClick() {
    let audioClipData = this.state.audioClipData;
    let descriptionData = this.state.descriptionData;
    const id = this.state.audioClipId;
    const x = Math.min(this.totalTimeLength - audioClipData[id].width - this.borderLength, audioClipData[id].controlledPosition.x + 10);
    const startTime = (this.state.currentSceneStartTime + x / this.totalTimeLength * (this.state.currentSceneEndTime - this.state.currentSceneStartTime)).toFixed(2);
    audioClipData[id].controlledPosition.x = x;
    descriptionData[this.state.currentSceneId].sentences.forEach(sentence => {
      if (sentence["sentence id"] == id) {
        sentence["audio start time"] = startTime;
      }
    });
    this.setState({
      descriptionData: descriptionData,
      audioClipData: audioClipData,
      audioClipTime: startTime,
    });
  }

  handleClickConvert() {
    this.setState({
      showHideNote: !this.state.showHideNote,
      showHideTimeline: !this.state.showHideTimeline,
    });
    // console.log("showHideNote "+this.state.showHideNote);
    // console.log("showHideTimeline "+this.state.showHideTimeline);   
  }

  handleTypeChange() {
    let audioClipData = this.state.audioClipData;
    let descriptionData = this.state.descriptionData;
    const id = this.state.audioClipId;
    if (!id) {
      return;
    }

    // update x, width, and playback type in audioClipData
    const type = event.target.value;
    if (type == "inline") {
      const width = audioClipData[id].actualWidth;
      if (width > this.totalTimeLength - this.borderLength) {
        alert("Sorry, this sentence cannot be inline because it is longer than the original scene.");
        return;
      }
      const x = Math.min(this.totalTimeLength - width - this.borderLength, audioClipData[id].controlledPosition.x);
      audioClipData[id].width = width;
      audioClipData[id].controlledPosition = {x: x, y: 0};
    } else {
      audioClipData[id].width = 5;
      audioClipData[id].controlledPosition.y = -99;
    }
    audioClipData[id].type = type;  // this has to be after the above return statement

    // update start time in this.state.descriptionData
    const startTime = (this.state.currentSceneStartTime + audioClipData[id].controlledPosition.x / this.totalTimeLength * (this.state.currentSceneEndTime - this.state.currentSceneStartTime)).toFixed(2);
    descriptionData[this.state.currentSceneId].sentences.forEach(sentence => {
      if (sentence["sentence id"] == id) {
        sentence["audio type"] = type;
        sentence["audio start time"] = startTime;
      }
    });

    // save updates
    this.setState({
      descriptionData: descriptionData,
      audioClipData: audioClipData,
      audioClipType: type,
    });
  }

  // https://stackoverflow.com/questions/50173076/reactjs-how-to-render-pair-value-of-assoc-array
  // https://reactjs.org/docs/lists-and-keys.html
  render() {
    const opts = {
      height: "400",
      width: this.totalTimeLength,
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
        <div style={{display: "flex", padding: 10, border: "0.2px solid gray", marginBlockStart: 30, marginBlockEnd: 30}}>
          <div>
            <YouTube
              videoId={this.state.youtubeId}
              opts={opts}
              onStateChange={(event) => this.handleStateChange(event)}
              onPlay={(event) => this.handlePlay(event)}
            />
            <hr/>
            {this.state.showHideNote && 
            <div style ={{display: "flex"}}>
            <h6 style={{width: "20%", paddingTop: 15}}><b>Saved Notes for Scene {this.state.currentSceneNumber}</b></h6>
            <br/>
            <textarea
              defaultValue={this.state.currentSceneNote}
              onChange={(event) => this.handleNoteChange(event)}
              style={{display: "flex",padding: 10, border: "2px solid gray", marginBlockEnd: 25,marginBlockStart: 15, width: "80%", height: 120, marginInlineStart:10}}
            /> 
            {/* <Button type="submit" onClick={this.handleSaveNote} style={{fontWeight:"bold",width:120,height: 40, marginTop: 20, marginBlockStart: 125, marginBottom: 10, marginInlineStart:3 }} variant="success">Save</Button> */}
            </div>}
            {this.state.showHideTimeline && 
            <div>
            <h5>
              <b>
                {convertSecondsToEditorFormat(this.state.currentSceneStartTime)} - {convertSecondsToEditorFormat(this.state.currentSceneEndTime)}&nbsp;
                ({(this.state.currentSceneEndTime - this.state.currentSceneStartTime).toFixed(2)} s)
              </b>
            </h5>
            <h6>Dialogue Timeline</h6>
            <div style ={{left: 0, width: this.totalTimeLength, height: 50, position: "relative", backgroundColor: "white", border: "2px solid gray"}}>
            {Object.entries(this.state.dialogueData).map(([key, value]) => (
              <Draggable
                axis="x"
                key={key}
                position={value.controlledPosition}
                bounds="parent"
                onStart={() => false}
              >
                <div style={{float: "left", cursor: "ew-resize", width: value.width, height: 46, position: "absolute", backgroundColor: "#64B5F6"}}></div>
              </Draggable>
            ))}
            </div>
            <br/>
            <h6>Description Timeline</h6>
            <div style ={{width: this.totalTimeLength, height: 50, position: "relative", background: "white", border: "2px solid gray"}}>
            {Object.entries(this.state.audioClipData).map(([key, value]) => (
              <Draggable
                axis="x"
                key={key}
                position={value.controlledPosition}
                bounds= {(value.type == "inline") ? "parent" : {top: -99, bottom: -99, left: 0, right: this.totalTimeLength - this.borderLength}}
                onDrag={this.handleDrag}
                onStart={this.handleStart}
              >
                <div
                  tabIndex={0}
                  id={key}
                  style={{
                    float: "left", cursor: "ew-resize",
                    width: value.width,
                    height: (value.type == "inline") ? 46 : 146,
                    backgroundColor: (value.type == "inline") ? "#FFB74D" : "#F44336",
                    position: "absolute"
                  }}
                >
                </div>
              </Draggable>
            ))}
            </div>

            <div>
              <form style={{display: "flex", marginInlineStart: 120, marginBlockStart: 30}}>
                <div className="radio">
                  <label>
                    <input style={{marginInlineStart: 20}} type="radio" value="inline" checked={this.state.audioClipType == "inline"} onChange={this.handleTypeChange}/>&nbsp;
                    Inline Description
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input style={{marginInlineStart: 20}} type="radio" value="extended" checked={this.state.audioClipType == "extended"} onChange={this.handleTypeChange}/>&nbsp;
                    Extended Description
                  </label>
                </div>
              </form>
              <div style={{display: "flex", marginInlineStart: 270, width: 150}}>
              <Link onClick={this.handleLeftClick} style={{color: "#17A2B8"}}><i className="fa fa-arrow-left"/></Link>
                &nbsp;{this.state.audioClipTime ? (this.state.audioClipTime + " (s)") : ""}&nbsp;
              <Link onClick={this.handleRightClick} style={{color: "#17A2B8"}}><i className="fa fa-arrow-right"/></Link>
              </div>
            </div>
            </div>}
          </div>

          <div id="scroll_bar" style={{marginLeft: 10, width: 800, maxHeight: 750, marginInlineStart: 20, overflowY: "scroll", border: "0.5px solid gray"}}>
            {this.state.scenes}
            <Button type="submit" onClick={this.handleClick}  style={{fontWeight:"bold", fontSize:16, padding: 15, marginLeft: 200, marginTop: 10, marginBlockStart: 25, marginBlockEnd: 25, marginRight: 25, marginBottom: 10}} variant="success">Done!</Button>
          </div>
        </div>
      </div>
    );
  }
}
export default VideoIndexerDescription;
