import React, { Component } from 'react';
import config from './config'
import io from 'socket.io-client'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import BottomBar from './BottomBar'
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      content: '',
      chat: []
    }
  }
  componentDidMount() {
    this.socket = io(config[process.env.NODE_ENV].endpoint)
    this.socket.on('init', (msg) => {
      let msgRev = msg.reverse()
      this.setState(state => ({
        chat: [...state.chat, ...msgRev],
      }), this.scrollToBottom)
    })
    this.socket.on('push', (msg) => {
      this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom);
    })
  }
  handleName(e){
    this.setState({
      name: e.target.value
    })
  }
  handleContent(e) {
    this.setState({
      content: e.target.value
    })
  }
  handleSubmit(e) {
    e.preventDefault()

    this.socket.emit('message', {
      name: this.state.name,
      content: this.state.content
    })
    this.setState(state => {
      return {
        chat: [...state.chat, {
          name: state.name,
          content: state.content
        }],
        content: '',
      }
    }, this.scrollToBottom)
  }
  scrollToBottom() {
    const chat = document.getElementById('chat')
    chat.scrollTop = chat.scrollHeight
  }
  render () {
    return (
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((element, i) => {
            return (
              <div key={i}>
                <Typography variant="caption" className="name">
                  {element.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {element.content}
                </Typography>
              </div>
            )
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          name={this.state.name}
        />
      </div>
    )
  }
}
export default App
