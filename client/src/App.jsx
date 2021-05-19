import React, { useState, useEffect } from 'react';
import CopyText from './CopyText.jsx';
import Timer from './styling/Timer.jsx';
import TextArea from './styling/TextArea.jsx';

import axios from 'axios';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timeElapsed: 0,
      stopwatch: '0:00',
      typedText: '',
      copyText: '',
      wordCount: 0,
      timeStarted: false,
      reset: true,
      finished: true,
      startTime: 0,
      endTime: 0,
      errorCount: 0,
      counter: undefined,
    }
    this.getText = this.getText.bind(this);
    this.startCounter = this.startCounter.bind(this);
    this.timeIncrement = this.timeIncrement.bind(this);
    this.endGame = this.endGame.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
  }

  componentDidMount() {
    this.getText();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.copyText !== nextState.copyText) {
      return true;
    }
    if (this.state.typedText !== nextState.typedText) {
      return true;
    }
    if (this.state.stopwatch !== nextState.stopwatch) {
      return true;
    }
    return false;
  }

  getText() {
    const url = 'http://localhost:1234';

    axios
      .get(`${url}/copy`)
      .then( res => {
        let string = res.data.slice(3, -5);
        let count = string.split(' ').length;
        let textbox = document.getElementById('typingarea');
        textbox.value = '';
        textbox.disabled = false;
        textbox.focus();
        this.setState({
          typedText: '',
          stopwatch: '0:00',
          copyText: string,
          wordCount: count
        });
      })
      .catch( err => {
        console.log(err);
      });
  }

  startCounter() {
    let timeElapsed = 0;

    let counter = setInterval(this.timeIncrement, 1000);

    this.setState({counter: counter});
  }

  timeIncrement() {
    let timeElapsed = this.state.timeElapsed + 1;
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed - (minutes * 60);
    let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
    this.setState({
      timeElapsed: timeElapsed,
      stopwatch: time
    })
  }

  endGame() {
    clearInterval(this.state.counter);
    let timeAtEnd = Math.floor(Date.now() / 1000);
    let textbox = document.getElementById('typingarea');
    textbox.disabled = true;
    let timeElapsed = timeAtEnd - this.state.startTime;
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed - (minutes * 60);
    let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
    console.log('time elapsed:', time);
    this.setState({
      timeElapsed: timeElapsed,
      endTime: timeAtEnd,
      finished: true,
      stopwatch: time
    });
  }

  handleTyping = (event) => {

    this.setState({
      typedText: event.target.value,
      reset: false
    })

    if (this.state.typedText.length >= this.state.copyText.length) {
      this.endGame();
    }

    // Start stopwatch
    if (!this.state.timeStarted) {
      console.log('starting stopwatch');
      let timeAtStart = Math.floor(Date.now() / 1000);
      this.setState({
        timeStarted: true,
        startTime: timeAtStart
      });
      this.startCounter();
    }
  }

  handleReset() {
    getText();
    clearInterval(this.state.counter);
    this.setState({
      reset: true
    })
  };

  handleErrors = (errors) => {
    this.setState({
      errorCount: errors
    });
  }

  render() {

    const timer = {
      display: 'grid',
      gridTemplateColumns: '[timer] 20% [button] 10%',
      margin: '5px 0px'
    }

    return (
      <>
      {this.state.copyText.length > 0 ? <CopyText
        copy={this.state.copyText}
        input={this.state.typedText}
        handleErrors={this.handleErrors}/>: null}
      <div style={timer}>
        <div role="timer">Time Elapsed: <span>{this.state.stopwatch}</span></div>
        {this.state.stopwatch !== '0:00' ? <button onClick={this.handleReset}>Restart</button>: null}
        </div>
      <TextArea
        id="typingarea"
        contenteditable
        autoFocus
        disabled
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => this.handleTyping(event) } />
    </>
    );
  }
}