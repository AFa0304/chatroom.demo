import React, { Component } from 'react'
import firebase from 'firebase';
import styled from 'styled-components'
import {Animated} from "react-animated-css";

export default class Chatroom extends Component {
    _isMounted = false;
    constructor(props){
      super(props);
      this.state = {
        "chatLogs":[],
        "submitContent":"",
        "colorList":["#ff5e00","#53b800","#045ba1","#3403bb","#3403bb","#960075","#790028","#bd0000","#0383a3","#c08300"]
      };
      this.logout = this.logout.bind(this);
      this.submitData = this.submitData.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onEnterPress = this.onEnterPress.bind(this);
    }

    componentWillMount(){
      const thisComponent = this;
      firebase.firestore().collection("ChatroomLogs").orderBy("CreateTime","asc").onSnapshot({
        // 監聽ChatroomLogs變化
      }, (collection) => {
        const resultData = [];
        collection.docs.forEach((log) => {
          resultData.push({log});
        });
        if(thisComponent._isMounted){
          thisComponent.setState({
            'chatLogs': resultData
          });
          this.refs.chatroomContent.scrollTop = this.refs.chatroomContent.scrollHeight;
        }
      },(error) => {
        console.log("firestore onSnapshot error",error);
      });
    }

    componentDidMount(){
      this._isMounted = true;
    }

    componentWillUnmount(){
      this._isMounted = false
    }

    submitData(event){
      event.preventDefault();
      const db = firebase.firestore();
      const {submitContent} = this.state;
      const {name} = this.props;
      this.setState({
        "submitContent":""
      });
      db.collection("ChatroomLogs").add({
          "Name":name,
          "Content":submitContent,
          "CreateTime":new Date().toISOString()
      });
    }

    logout(){
      this.props.setName("");
      firebase.auth().signOut();
    }

    onEnterPress(e){
      if(e.keyCode === 13 && e.shiftKey === false) {
        e.preventDefault();
        this.refs.submitBtn.click();
      }
    }

    handleChange(e){
      let stateName = e.currentTarget.getAttribute("name");
      let value = e.currentTarget.value;
      this.setState({
        [stateName]:value
      });
    }

    render() {
      const {chatLogs,submitContent} = this.state;
      const {name} = this.props;
      console.log(name.charCodeAt())
        return (
          <ChatroomContainer>
            <Animated animationIn="bounceInDown" animationInDelay={500} animationOut="fadeOut" isVisible={name.length>0}>
              <ChatroomHeader>
                <span>聊天室-{name}</span>
                <button onClick={this.logout}>X</button>
              </ChatroomHeader>
              <ChatroomContent ref="chatroomContent">
                <div>
                {
                  chatLogs.map((data,index)=>{
                    return(
                      <Animated animationIn="fadeIn" isVisible={true} key={index}>
                        <div>
                          <span>{data.log.data().Name}</span>: {data.log.data().Content}
                          <LogTimeText>{new Date(data.log.data().CreateTime).toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'})}</LogTimeText>
                        </div>
                      </Animated>
                    );
                  })
                }
                </div>
              </ChatroomContent>
              <ChatroomInput>
                <div>
                  <form onSubmit={(e)=>this.submitData(e)}>
                    <textarea name="submitContent" onKeyDown={(e)=>this.onEnterPress(e)} 
                              onChange={(e)=>this.handleChange(e)} value={submitContent}/>
                    <input type="submit" value="送出" ref="submitBtn"/>
                  </form>
                </div>
              </ChatroomInput>
            </Animated>
          </ChatroomContainer>
        )
    }
}
const ChatroomContainer = styled.div`
  width:80%;
  display:flex;
  position:absolute;
  top:40%;
  left:50%;
  transform:translate(-50%, -50%);
  -ms-transform:translate(-50%, -50%);
  -moz-transform:translate(-50%, -50%);
  -webkit-transform:translate(-50%, -50%);
  -o-transform:translate(-50%, -50%);
  flex-direction:column;
  justify-content:center;
  align-items:center;
  &>div{
    width:100%;
  }
`;
const ChatroomHeader = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  background-color: rgb(235, 232, 232);
  padding:8px;
  border-top-left-radius:8px;
  border-top-right-radius:8px;
`;
const ChatroomContent = styled.div`
  width:100%;
  max-height:20rem;
  display:flex;
  flex-direction:column;
  justify-content:flex-start;
  align-items:flex-start;
  background-color:white;
  overflow-y:auto;
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #F5F5F5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }
  &>div{
    padding:0.5rem
  }
  span{
    font-weight:bold;
  }
`;
const ChatroomInput = styled.div`
  width:100%;
  height:8rem;
  overflow:hidden auto;
  form{
    display:flex;
    input[type="submit"]{
      border:0.2px solid rgb(169, 169, 169);
      flex-basis:15%;
      font-weight:bold;
      font-family: LiHeiPro,Microsoft JhengHei;
      background-color: rgb(235, 232, 232);
      cursor: pointer;
      &:hover{
        background-color: rgb(177, 177, 177);
      }
    }
  }
  textarea{
    width:100%;
    height:4rem;
    resize:none;
    padding:0;
    margin:0;
    padding:0.5rem
  }
`;
const LogTimeText = styled.span`
  font-size:8px;
  margin-left:0.5rem;
`;