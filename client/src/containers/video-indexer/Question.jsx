import React from "react";
import { Link } from "react-router";
import Iframe from "react-iframe";
import { Slider, Direction } from "react-player-controls";
import { Navbar, Nav, NavDropdown, Button, FormControl, Form, Table } from "react-bootstrap";

class Question extends React.Component{
    constructor(props){
      super(props);
      this.state={
        humanQuestions: [],
        qnaList: this.props.qnaList,
        systemQuestions: [],
        sceneId: this.props.sceneId,
      }
    }

    componentWillMount() {
      const systemQuestions = [];
      const items = this.state.qnaList;
      items.forEach(item => {
        systemQuestions.push(
          <div key={item.questionId} id={item.questionId}>
            {item.question}
          </div>
        );
      });
      this.setState({
        systemQuestions: systemQuestions,
      });
    }

    addQuestion(){
        this.setState({humanQuestions:[...this.state.humanQuestions,""]})
    }

    handleChange(e, index){
        this.state.humanQuestions[index]= e.target.value
        this.setState({humanQuestions:this.state.humanQuestions})
    }

    removeQuestion(index){
        this.state.humanQuestions.splice(index,1)
        console.log(this.state.humanQuestions,"$Question$");
        this.setState({humanQuestions: this.state.humanQuestions})
    }

    render() {
      return (
        <div>
        <div style ={{display: "flex"}}>
        <h6><b>System Generated Question </b></h6>
        <div className="Question" style={{ display: "flex",padding: 10, border: "2px solid gray", marginBlockEnd: 25, width: 400, marginInlineStart:0}}>
          {this.state.systemQuestions}
        </div>
        </div>
        <Button onClick={(e)=>this.addQuestion(e)} type="submit" style={{fontWeight:"bold", marginTop: 20,marginBlockStart: 2,    marginBottom: 10, marginInlineStart:325 }} variant="warning">Add More Questions</Button>
        {
            this.state.humanQuestions.map((humanQuestion,index )=>{
                return(
                    <div className="Question" key={index}>
                        <label><h6><b>Question </b></h6></label>
                        <input
                          name="humanQuestion"
                          sceneid={this.state.sceneId}
                          questionid={`question_id_${index}`}
                          answerid={`answer_id_${index}`}
                          onChange={(e)=>this.handleChange(e, index)}
                          style={{ padding: 10, border: "2px solid gray", marginBlockEnd: 25, width: 200, marginInlineStart:30}}
                          value={humanQuestion}
                        />
                        <Button onClick={()=>this.removeQuestion(index)} type="submit" style={{fontWeight:"bold", marginTop: 20,marginBlockStart: 2 , marginInlineStart:30,    marginBottom: 10 }} variant="danger">Remove</Button>
                    </div>   
                )
            })
        }
        
        </div> 
        // end of new ui
      );
    }
}
export default Question;
