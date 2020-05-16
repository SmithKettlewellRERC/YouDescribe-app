import React, { Component } from "react";
import { Link } from "react-router";
import Iframe from "react-iframe";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import Question from "./Question.jsx";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import axios from 'axios';
import Speech from 'react-speech';
import Modal from 'react-awesome-modal';




class VideoIndexerDescriptionComponent extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      qnaData: [],
      show: false,
      visible : false,
      sceneId: this.props.sceneId,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      description: this.props.description,
      ocr: this.props.ocr,
    };
    this.toggleDiv = this.toggleDiv.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleOcrChange = this.handleOcrChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickPlay = this.handleClickPlay.bind(this);
  }

  componentWillMount() {
    document.title = "Scenes";
    this.loadSceneIds();
  }

  loadSceneIds() {
    const url = `http://18.221.192.73:5001/videoData?videoid=7QZNpS0uos4&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
    ourFetch(url).then((response) => {      
      const sceneIds = [];// create an empty array of scenes[]
      const items = response.modifiedData;
      items.forEach(item => {               // iterate the modifiedData[]
        sceneIds.push(item.sc_id);
      });
      this.setState({                       // assign the scenes[] to the constructor
        sceneIds: sceneIds,
      });
      console.log("SceneIds:"+sceneIds);
    });
  }

  handleClick() {
    const sceneArr = [];
   
      const element = document.getElementById(this.props.sceneId);
      sceneArr.push({
        scene_id: element.getAttribute("id"),
        modified_description: element.getAttribute("description"),
        modified_ocr: element.getAttribute("ocr"),
        start_time: element.getAttribute("starttime"),
        end_time: element.getAttribute("endtime"),
        has_ai: true,
      });  
    console.log(sceneArr);
    const qnaData = this.state.qnaData;
    const elements = Array.prototype.slice.call(document.getElementsByName("humanQuestion")) || [];
    elements.forEach(element => {
      const sceneId = element.getAttribute("sceneid");
      if (!qnaData[sceneId]) {
        qnaData[sceneId] = [];
      }
      qnaData[sceneId].push({
        questionId: element.getAttribute("questionid"),
        answerId: element.getAttribute("answerid"),
        question: element.value,
        answer: "",
      });
    });
    
    console.log("qnaData:");
    console.log(qnaData);
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
    });

    this.setState({
      visible : true
  });
   // Alert('You have saved the description ')
   }

   async handleClickPlay(){
    const element = document.getElementById(this.props.sceneId);
    let inputText = "";
    let mp3data = "";
    inputText = element.getAttribute("description");
    console.log({inputText});
    const body2 ={
      'inputText': inputText
     };
     await axios.post('http://18.221.192.73:5001/descriptionMp3Audio',body2)
        .then((res) => {
            console.log(res);
           // mp3data= res.data;
           // console.log({mp3data});
            // this.setState({
            //   ...this.state,
            //   mp3data: res.data
            // });
                  })
        .catch(e => console.log(e));
    // console.log("abcd "+this.state.mp3data);
}

  toggleDiv() {
    const {show} = this.state;
    this.setState({
      show: !show
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value,
    });
  }

  handleOcrChange(event) {
    this.setState({
      ocr: event.target.value,
    });
  }

  closeModal() {
    this.setState({
        visible : false
    });
}

  

  render() {

 

   
    return (
      // start of new ui
      <div
        id={this.state.sceneId}
        starttime={this.state.startTime}
        endtime={this.state.endTime}
        description={this.state.description}
        ocr={this.state.ocr}
      >
        <div style={{ padding: 10, border: "3px solid gray", marginBlockStart: 25, marginBlockEnd: 25}} id={this.props.sceneId} >
          <div style={{display: "flex"}}>
            <h5><b>Scene {this.props.scene_num} </b></h5><br/>
            <p style={{marginLeft: 50, width: 220, paddingTop: 1, color:"#008CBA",fontWeight:"bold"}}>
              {this.props.startTime} - {this.props.endTime} (s)
              <Slider
                isEnabled={true}
                direction={Direction.HORIZONTAL}
              >
                <div
                  style={Object.assign({}, {
                    position: "absolute",
                    background: "#878c88",
                    borderRadius: 4,
                    top: 6,
                    bottom: 0,
                    left: 0,
                    width: "105%",
                    height: 4,
                  })}
                />
                <div
                  id={this.state.sceneId + "_progress_bar"}
                  style={Object.assign({}, {
                    position: "absolute",
                    width: 16,
                    height: 16,
                    background: "#32CD32",
                    borderRadius: "100%",
                    top: 0,
                    left: 0,
                  })}
                />
              </Slider>
            </p>
          </div>
          <br />
          <div style ={{display: "flex"}}>
            <h6><b>Description </b></h6>
            <textarea
              defaultValue={this.props.description}
              onChange={(event) => this.handleDescriptionChange(event)}
              style={{display: "flex",padding: 10, border: "2px solid gray", marginBlockEnd: 25, width: 400, height: 200, marginInlineStart:10}}
            /> 
          </div>
          <div style ={{display: "flex"}}>
            <h6><b>Text on Screen </b></h6>
            < textarea
              defaultValue={this.props.ocr}
              onChange={(event) => this.handleOcrChange(event)}
              style={{ display: "flex",padding: 10, border: "2px solid gray", marginBlockEnd: 15, width: 400}}
            />
          </div>
          {/* <Button onClick={this.toggleDiv} type="submit" style={{fontWeight:"bold", marginTop: 20,marginBlockStart: 2,    marginBottom: 10, marginInlineStart:433}} variant="warning">Next</Button>
          {
            this.state.show &&
            <Question
              sceneId={this.props.sceneId}
              qnaList={this.props.qnaList}
            /> 
          }*/}

      <div>
        <Button type="submit" onClick={this.handleClick} style={{fontWeight:"bold",width:100, marginTop: 20,marginBlockStart: 2,  marginBottom: 10,marginInlineStart:400 }} variant="success">Save</Button>

        <Modal visible={this.state.visible} width="400" height="200" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <h1 style={{display: "flex", justifyContent: "center", padding: 10}}>Succefully Saved! </h1>
                        <p style={{display: "flex", justifyContent: "center", padding: 10}}>You are succesfully able to save the descriptions and text on screen of the Scene {this.props.scene_num}. Thank you!</p>
                        <a href="javascript:void(0);" style={{display: "flex", justifyContent: "center", padding: 10}} onClick={() => this.closeModal()}>Close</a>
                    </div>
        </Modal>

        <Button type="submit" onClick={this.handleClickPlay} style={{fontWeight:"bold",width:200, marginTop: 20, marginBlockStart: 2, marginBottom: 10, marginInlineStart:300 }} variant="primary">Convert Text to Speech</Button>
        <audio style={{width:500}} ref="audio_tag"  controls src="http://18.221.192.73:5001/audio/output.mp3" ></audio> 
       
       {/* API: https://www.npmjs.com/package/react-speech */}
       {/* <Speech  
      //  styles={mystyle}
       text={this.state.description}
       stop={true} 
       pause={true} 
       resume={true}
       rate="0.75"
       textAsButton={true} 
       displayText="Play Text to Speech" 
       /> */}
    
        </div>
        </div>
       
      </div>
      // end of new ui
    );
  }
}
export default VideoIndexerDescriptionComponent;
