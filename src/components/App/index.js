import { style as s } from "./style"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import React, { PureComponent, Fragment } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import DatePicker from 'material-ui/DatePicker';
import moment from "moment"
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';

const _ = console.log

export default class App extends PureComponent {
  state = {
    questions: [],
    quotationFile: null,
    date: null,
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
      const base64 = upload.target.result
      // _("[base64]", base64)
    }
    reader.readAsDataURL(firstFile)
  }

  openFileDialog = () => {
    const inputElm = document.querySelector("#quotationFile")
    inputElm.click()
  }

  onChangeDate = (event, date) => {
    _("[date]", date)
    this.setState({date});
  };

  getFormInput = ques => {
    const {isValid, title, type} = ques
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

  parsePayload(){
    try{
      const {location: {search}} = window
      const base64 = search.replace("?payload=", "")
      const str = atob(base64)
      const questions = JSON.parse(str)
      this.setState({questions})
    }catch(err){
      _("[parsePayload][ERR]", err)
    }
  }

  componentDidMount() {
    this.parsePayload()
  }

  componentWillUnmount() {}

  render() {
    const questions = this.getShouldAskQuesList()
    _("[questions]", questions)
    return (
      <MuiThemeProvider>
        <div style={s.rootDiv}>
          <div style={s.quesDiv}>
            {questions.map(ques => this.getFormInput(ques))}
          </div>
        </div>

      </MuiThemeProvider>
    )
  }
}
