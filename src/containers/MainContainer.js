import React, { Component } from 'react';
import styled from 'styled-components'
import firebase from 'firebase';
import {Animated} from "react-animated-css";

import Chatroom from '../components/Chatroom';

export default class MainContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      "account":"",
      "password":"",
      "errorMsg":"",
      "reg_userName":"",
      "reg_account":"",
      "reg_password":"",
      "isRegister":false
    };
    this.login = this.login.bind(this);
    this.saveNameToStore = this.saveNameToStore.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
          this.props.setName(firebase.auth().currentUser.displayName);
      } else {
        console.log("not login");
      }
    });
  }

  saveNameToStore(userName){
    this.props.setName(userName);
    return false;
  }

  login(event){
    event.preventDefault();
    const {account,password} = this.state;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=>{
      firebase.auth().signInWithEmailAndPassword(account,password).then(() => {
        const currentUser = firebase.auth().currentUser;
        if(currentUser !== null){
          this.saveNameToStore(currentUser.displayName);
          this.setState({
            "errorMsg":""
          });
        }
      }).catch(error=>{
        console.log(error)
        this.setState({
          "errorMsg":error.message||"登入失敗！"
        })
      });
    })
  }

  register(event){
    event.preventDefault();
    const {reg_account,reg_password,reg_userName} = this.state;
    firebase.auth().createUserWithEmailAndPassword(reg_account,reg_password).then(()=>{
      const currentUser = firebase.auth().currentUser;
      if(currentUser !== null){
        currentUser.updateProfile({
          "displayName":reg_userName
        }).then(()=>{
          this.saveNameToStore(reg_userName);
          this.setState({
            "errorMsg":"",
            "isRegister":false,
            "reg_userName":"",
            "reg_account":"",
            "reg_password":"",
          })
        })
      }
    }).catch(error=>{
      this.setState({
        "errorMsg":error.message||"註冊失敗！"
      })
    })
  }

  handleChange(e){
    let stateName = e.currentTarget.getAttribute("name");
    let value = e.currentTarget.value;
    this.setState({
      [stateName]:value
    });
  }

  switchToRegister(isReg){
    this.setState({
      "error":"",
      "isRegister":isReg
    })
  }

  render() {
    const {account,password,errorMsg,isRegister,reg_account,reg_password,reg_userName} = this.state;
    const {name,setName} = this.props;
    console.log(name)
    return (
      <Container>
        <InputNameDiv>
            {
              !isRegister?
              <InputNameAnimated animationIn="bounceInLeft" animationOut="fadeOut" animationOutDuration={300} isVisible={!name.length>0}>
                <form onSubmit={(e) => this.login(e)}>
                  <Animated className="errorMsg" animationIn="shake" animationOut="fadeOut" animationInDuration={200} isVisible={errorMsg.length>0}>
                    {errorMsg}
                  </Animated>
                  <div>
                    <span>帳號：</span>
                    <input type="text" name="account" value={account} onChange={(e)=>this.handleChange(e)}/>
                  </div>
                  <div>
                    <span>密碼：</span>
                    <input type="password" name="password" value={password} onChange={(e)=>this.handleChange(e)}/>
                  </div>
                  <div><input type="submit" value="登入"/></div>
                  <div>還沒有帳號嗎？<span onClick={()=>this.switchToRegister(true)} className="regText">點此註冊</span></div>
                </form>
              </InputNameAnimated>
                :
                <div>
                  <InputNameAnimated className="registerDiv" animationIn="bounceInLeft" isVisible={true}>
                    <form onSubmit={(e) => this.register(e)}>
                      <Animated className="errorMsg" animationIn="shake" animationOut="fadeOut" animationInDuration={200} isVisible={errorMsg.length>0}>
                        {errorMsg}
                      </Animated>
                      <div>
                        <span>暱稱：</span>
                        <input type="text" name="reg_userName" value={reg_userName} onChange={(e)=>this.handleChange(e)}/>
                      </div>
                      <div>
                        <span>帳號：</span>
                        <input type="text" name="reg_account" value={reg_account} onChange={(e)=>this.handleChange(e)}/>
                      </div>
                      <div>
                        <span>密碼：</span>
                        <input type="password" name="reg_password" value={reg_password} onChange={(e)=>this.handleChange(e)}/>
                      </div>
                      <div>
                        <input type="submit" value="註冊並登入"/>
                        <input type="button" value="返回" onClick={()=>this.switchToRegister(false)}/>
                      </div>
                    </form>
                  </InputNameAnimated>
              </div>
            }
        </InputNameDiv>
        {
          name && <Chatroom name={name} setName={setName}/>
        }
      </Container>
    )
  }
}
const Container = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
`;
const InputNameDiv = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
`;
const InputNameAnimated = styled(Animated)`
  display:flex;
  flex-direction:row;
  color:white;
  div{
    text-align:center;
    margin-top:1rem;
    input[type="submit"],input[type="button"]{
      width:120px;
      padding:0.4rem 0;
      border:none;
      border-radius:5px;
      background-color: rgb(235, 232, 232);
      cursor: pointer;
      &:hover{
        background-color: rgb(177, 177, 177);
      }
    }
  }
  &.registerDiv{
    input[type="submit"],input[type="button"]{
      width:8rem;
      padding:0.4rem 0;
      margin:0.5rem;
    }
  }
  .errorMsg{
    color:red;
  }
  .regText{
    text-decoration:underline;
    cursor: pointer;
  }
`;