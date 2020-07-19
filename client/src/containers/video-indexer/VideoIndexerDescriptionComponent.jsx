import React, { Component } from "react";
import { Link } from "react-router";
import Iframe from "react-iframe";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import Question from "./Question.jsx";
import { ourFetch, convertSecondsToCardFormat } from "../../shared/helperFunctions";
import ContentEditable from "react-contenteditable";
import axios from 'axios';
import Speech from 'react-speech';
import Modal from 'react-awesome-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class VideoIndexerDescriptionComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      qnaData: [],
      show: false,
      visible : false,
      buttonText: "Convert Text to Speech",
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      descriptions: this.props.descriptions,
      sentences: {},
      ocr: this.props.ocr,
    };

    this.sceneId = this.props.sceneId;
    this.youtubeId = this.props.youtubeId;
    this.callback = this.props.callback;
    this.toggleDiv = this.toggleDiv.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSentenceChange = this.handleSentenceChange.bind(this);
    this.handleOcrChange = this.handleOcrChange.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    //this.handleClickConvert = this.handleClickConvert.bind(this);
  }

  componentWillMount() {
    document.title = "Scenes";
    this.loadSentences();
  }

  loadSentences() {
    if (!this.state.descriptions || this.state.descriptions.length == 0) {
      return;
    }
    const sentences = {};
    this.state.descriptions.forEach(description => {
      sentences[description["sentence id"]] = description["sentence"];
    });
    this.setState({
      sentences: sentences,
    });
  }

  stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  handleSaveClick() {
    const sceneArr = [];
    const element = document.getElementById(this.sceneId);
    let description = "";
    for (let [key, value] of Object.entries(this.state.sentences)) {
      description += value;
    }
    description = this.stripHtml(description);

    sceneArr.push({
      scene_id: element.getAttribute("id"),
      modified_description: description,
      modified_ocr: element.getAttribute("ocr"),
      start_time: element.getAttribute("starttime"),
      end_time: element.getAttribute("endtime"),
      has_ai: true,
    });
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
    
    // console.log(sceneArr);
    // console.log(qnaData);
    const urlToSave = `http://18.221.192.73:5001/saveAiDescription`;
    const optionObj = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: "9fe1e2c6-5cd2-11ea-bc55-0242ac130003",
        videoId: this.youtubeId,
        scene_arr: sceneArr,
        qnaData: qnaData,
      }),
    };
    ourFetch(urlToSave, true, optionObj).then((response) => {
      // console.log("response: " + JSON.stringify(response));
      const urlToFetch = `http://18.221.192.73:5001/generateAudioDescriptionMp3ForScene?videoId=${this.youtubeId}&volunteerId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003&sceneId=${this.sceneId}`;
      ourFetch(urlToFetch).then((response) => {
        const sentences = {};
        this.setState({
          descriptions: response[this.sceneId]["sentences"],
        }, () => {
          this.loadSentences();
          this.callback(this.sceneId, response[this.sceneId]);
        });
      });
    });

    toast.success('Saved!', {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // handleClickConvert() {
  //   this.setState({
  //     showHideNote: false,
  //     showHideTimeline: true,
  //   });
  //   console.log("showHideNote "+this.state.showHideNote);
  //   console.log("showHideTimeline "+this.state.showHideTimeline);
  // }

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

  handleSentenceChange(event, sentenceId) {
    const sentences = this.state.sentences;
    sentences[sentenceId] = event.target.value;
    this.setState({
      sentences: sentences,
    });
  }

  handleOcrChange(event) {
    this.setState({
      ocr: event.target.value,
    });
  }

  // closeModal() {
  //   this.setState({
  //     visible: false
  //   });
  // }

  eventToggle() {
    //console.log('eventHandler1 called!');
    let buttonText = this.state.buttonText == "Convert Text to Speech" ? "View Saved Notes" : "Convert Text to Speech"
    this.setState({
      buttonText: buttonText
    });
   // console.log("buttonText "+this.state.buttonText);
    this.props.indexerDescription.handleClickConvert();
  }

  render() {
    return (
      <div
        id={this.sceneId}
        starttime={this.state.startTime}
        endtime={this.state.endTime}
        descriptions={this.state.descriptions}
        ocr={this.state.ocr}
        style={{padding: 10, border: "3px solid gray", marginBlockStart: 25, marginBlockEnd: 25}}
      >
          <div style={{display: "flex"}}>
            <h5><b>Scene {this.props.scene_num} </b></h5><br/>
            <span style={{marginLeft: 50, width: 220, paddingTop: 1, color:"#008CBA",fontWeight:"bold"}}>
              {convertSecondsToCardFormat(this.props.startTime)} - {convertSecondsToCardFormat(this.props.endTime)}
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
                  id={this.sceneId + "_progress_bar"}
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
            </span>
          </div>
          <br/>
          <div style={{display: "flex"}}>
            <h6><b>Description </b></h6>
            <div style={{backgroundColor: "#FFFFFF", padding: 5, border: "2px solid gray", marginBlockEnd: 25, width: 410, marginInlineStart: 8}}>
            {Object.entries(this.state.sentences).map(([key, value]) => (
              <ContentEditable
                key={key}
                id={key + "_textarea"}
                html={value}
                onChange={(event) => this.handleSentenceChange(event, key)}
                style={{wordBreak: "break-all"}}
              />
            ))}
            {/* {Object.entries(this.state.sentences).map(([key, value]) => (
              <textarea
                key={key}
                id={key + "_textarea"}
                defaultValue={value}
                onChange={(event) => this.handleSentenceChange(event, key)}
              />
            ))} */}
            </div>
          </div>
          <div style={{display: "flex"}}>
            <h6><b>Text on Screen </b></h6>
            <ContentEditable
              html={this.state.ocr}
              onChange={(event) => this.handleOcrChange(event)}
              style={{wordBreak: "break-all", backgroundColor: "#FFFFFF", padding: 5, border: "2px solid gray", marginBlockEnd: 15, width: 390, marginInlineStart: 5}}
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
            <Button type="submit" onClick={this.handleSaveClick} style={{fontWeight:"bold",width:100, marginTop: 20,marginBlockStart: 2, marginBottom: 10,marginInlineStart:400 }} variant="success">Save</Button>
            <ToastContainer />
          
            <Button type="submit" onClick={() => {this.eventToggle();}} style={{fontWeight:"bold",width:200, marginTop: 20, marginBlockStart: 2, marginBottom: 10, marginInlineStart:300 }} variant="primary">{this.state.buttonText}</Button>
            
          </div>
      </div>
    );
  }
}
export default VideoIndexerDescriptionComponent;
