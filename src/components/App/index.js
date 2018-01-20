import moment from "moment"
import { style as s } from "./style"
import TextField from "material-ui/TextField"
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from "material-ui/RaisedButton"
import React, { PureComponent, Fragment } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
// import MenuItem from 'material-ui/MenuItem';
// import {List, ListItem} from 'material-ui/List';
// import thanksImg from "../../asset/img/thank-you.png"

const _ = console.log

export default class App extends PureComponent {
  state = {
    questions: [],
    quotationFile: null,
  }

  getShouldAskQuesList(){
    const {questions} = this.state
    return questions.filter(ques => ques.shouldAsk)
  }

  // onFileLoad = (e, file) => _(e.target.result, file.name)
  onFileLoad = e => {
    const firstFile = e.target.files[0]
    if(!firstFile) return
    const {name} = firstFile
    this.setState({quotationFile: name})
    const reader = new FileReader()
    reader.onload = (upload) => {
      // const base64 = upload.target.result
      // _("[base64]", base64)
    }
    reader.readAsDataURL(firstFile)
  }

  openFileDialog = () => {
    const inputElm = document.querySelector("#quotationFile")
    inputElm.click()
  }

  onChangeDate = key => (event, date) => {
    _("[date]", date)
    this.setState({key: date});
  };

  getFormInput = ques => {
    const {isValid, title, type, key} = ques
    const rawTitle = title.replace(/[^a-zA-Z0-9\s]/g,'')
    switch (isValid){
      case "DATE": {
        return (
          <DatePicker
            floatingLabelText={rawTitle}
            formatDate={date => moment(date).format("DD/MM/YYYY")}
            textFieldStyle={s.inputDiv}
            onChange={this.onChangeDate}
          />
        )
      }
      default: {
        if(type === "attachment"){
          const {quotationFile} = this.state
          return (
            <div style={s.upFileDiv}>
              <RaisedButton
                label={rawTitle}
                onClick={this.openFileDialog} />
              <input
                id={"quotationFile"}
                type='file'
                style={{ display: 'none' }}
                accept={this.props.accept}
                onChange={this.onFileLoad} />
              <div>{quotationFile || "Chosen File"}</div>
            </div>)
        }
        return (<TextField
          style={s.inputDiv}
          floatingLabelText={rawTitle}
        />)
      }
    }
  }

  hexToString = (hex) => {
    let string = '';
    for (let i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }

  parsePayload = () => {
    try{
      const {location: {search}} = window
      const params = search.split("&")
      const payloadParam = params.filter(param => param.includes("?payload"))[0]
      _("[payloadParam]", payloadParam)

      if(!payloadParam) {
        _("[?payload=] Not found")
        return
      }

      const pHex = payloadParam.replace("?payload=", "")
      const str = this.hexToString(pHex)
      const {questions} = JSON.parse(str)
      this.setState({questions})
    }catch(err){
      _("[parsePayload][ERR]", err)
    }
  }

  loadMessengerSDK = () => {
    (function(d, s, id){
      let js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'Messenger'));
  }

  closeWebview = () => {
    const {MessengerExtensions} = window
    if(!MessengerExtensions) return
    MessengerExtensions.requestCloseBrowser(()=>{
      _("[closeWebview] success")
    }, (err) => {
      _("[closeWebview][ERR]", err)
    });
  }

  save = () => {
    // const imgUrl = "https://tinker.press/images/cloud-icon-22.png"
    // const messengerUrl = `https://www.messenger.com/closeWindow/?image_url=${imgUrl}&display_text=Thank You`
    // window.location.href = messengerUrl
    this.closeWebview()
  }

  componentDidMount() {
    this.parsePayload()
    this.loadMessengerSDK()
  }

  componentWillUnmount() {}

  render() {
    const questions = this.getShouldAskQuesList()
    _("[questions]", questions)
    return (
      <MuiThemeProvider>
        <div style={s.rootDiv}>
          <div style={s.title}>ENT REQUEST</div>
          <div style={s.quesDiv}>
            {questions.map((ques, index) => <div key={ques.key || index}>{this.getFormInput(ques)}</div>)}
          </div>
          <RaisedButton label={"Save"} primary={true} fullWidth={true} onClick={this.save} />
        </div>
      </MuiThemeProvider>
    )
  }
}
