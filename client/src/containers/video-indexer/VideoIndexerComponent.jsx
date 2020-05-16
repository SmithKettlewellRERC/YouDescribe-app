import React, { Component } from "react";
import { Link } from "react-router";
import Iframe from "react-iframe";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";
import { ourFetch, convertTimeToCardFormat, convertViewsToCardFormat } from "../../shared/helperFunctions";
import Modal from 'react-awesome-modal';

class VideoIndexerComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        qnaData: [],
        visible : false,
        id: this.props.id,        
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        originalDescription: this.props.originalDescription,
        ocr: this.props.ocr,
      };
      this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
      document.title = "Scenes";
      this.loadSceneIds();
    }

    loadSceneIds() {
      
      const url = `http://18.221.192.73:5001/videoData?videoid=7QZNpS0uos4&userId=9fe1e2c6-5cd2-11ea-bc55-0242ac130003`;
      ourFetch(url).then((response) => {      
        const sceneIds = [];                  // create an empty array of scenes[]
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
      console.log(this.props.id);
      const sceneArr = [];
      let flag = false;
      const element1 = document.getElementById(this.props.id);
      let scene_id_temp = element1.getAttribute("id");
      let modified_description_temp = element1.getAttribute("originalDescription");
      if(modified_description_temp===null || modified_description_temp === undefined)
      modified_description_temp = "";
      let modified_ocr_temp = element1.getAttribute("ocr");
      if(modified_ocr_temp===null || modified_ocr_temp === undefined)
        modified_ocr_temp = "";
      let start_time_temp = element1.getAttribute("starttime");
      let end_time_temp = element1.getAttribute("endtime");
      let has_ai_temp = true;
      this.state.sceneIds.map(id => {
        if(flag){
          const element = document.getElementById(id);
          let dScene = [];
          dScene.push(element.getAttribute("id"));
          sceneArr.push({
            scene_id: scene_id_temp,
            modified_description: modified_description_temp + element.getAttribute("originalDescription"),
            modified_ocr: modified_ocr_temp + element.getAttribute("originalOcr"),
            start_time: start_time_temp,
            end_time: element.getAttribute("endtime"),
            has_ai: true,
            deletedScene: dScene
          }); 
      
        } 
        if(id===this.props.id)
        {
          flag = true;
        }else{
          flag = false;
        }
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
          qnaData: "",
        }),
      };
      this.setState({
        visible : true
    });
      ourFetch(url, true, optionObj).then((response) => {
        console.log("response: " + JSON.stringify(response));
        console.log({ user_id: "9fe1e2c6-5cd2-11ea-bc55-0242ac130003",
        videoId: "7QZNpS0uos4",
        scene_arr: sceneArr,
        qnaData: qnaData})

      });
      
    }

    closeModal() {
      this.setState({
          visible : false
      });
      window.location.reload(false);
  }

    render() {
      return (
        <div
        id={this.state.id}
        starttime={this.state.startTime}
        endtime={this.state.endTime}
        originalDescription={this.state.originalDescription}
        ocr={this.state.ocr}
        >
        <div style={{padding: 5, border: "3px solid gray", marginBlockStart: 25, marginBlockEnd: 25, width: 500}}>
          <div style={{display: "flex"}}>
            <h5 style={{width: 160, marginRight: 10}}><b>Scene {this.props.scene_num}</b></h5>
            <p style={{ marginRight: 30, fontWeight:"bold", marginLeft: 50, width: 400, paddingTop: 1, color:"#008CBA" }}>
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
                  id={this.state.id + "_progress_bar"}
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
            <Button type="submit" onClick={this.handleClick} style={{fontWeight:"bold", fontSize:14,marginLeft: 10}} variant="warning">Merge with Next scene.</Button>
            <Modal visible={this.state.visible} width="400" height="200" effect="fadeInUp" onClickAway={() => this.closeModal()}>
                    <div>
                        <h1 style={{display: "flex", justifyContent: "center", padding: 10}}>Succefully Merged! </h1>
                        <p style={{display: "flex", justifyContent: "center", padding: 10}}>You are succesfully able to merge the Scene {this.props.scene_num} with {this.props.scene_num + 1}. Thank you!</p>
                        <a href="javascript:void(0);" style={{display: "flex", justifyContent: "center", padding: 10}} onClick={() => this.closeModal()}>Close</a>
                    </div>
        </Modal>
          </div>
          {/* <div style={{display: "block"}}>
            Description: {this.props.originalDescription}
          </div> */}
        </div>
        </div>
      );
    }
}
export default VideoIndexerComponent;
