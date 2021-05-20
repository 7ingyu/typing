import React, { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import CopyText from './components/CopyText.jsx';
import Analysis from './components/Analysis.jsx';
import History from './components/History.jsx';
import TextArea from './styling/TextArea.jsx';

import axios from 'axios';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: undefined,
      login: undefined,
      loginWarning: '',
      history: [],
      httpError: false,
      timeElapsed: 0,
      stopwatch: '0:00',
      typedText: '',
      copyText: '',
      wordCount: 0,
      timeStarted: false,
      reset: true,
      finished: false,
      startTime: 0,
      endTime: 0,
      errorCount: 0,
      counter: undefined,
      bestScore: 0,
      wpm: 0,
    }
    this.getText = this.getText.bind(this);
    this.startCounter = this.startCounter.bind(this);
    this.timeIncrement = this.timeIncrement.bind(this);
    this.endGame = this.endGame.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
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
    if (this.state.finished !== nextState.finished) {
      return true;
    }
    if (this.state.login !== nextState.login) {
      return true;
    }
    if (this.state.loginWarning !== nextState.loginWarning) {
      return true;
    }
    return false;
  }

  getText() {
    const url = 'http://localhost:1234';

    axios
      .get(`${url}/copy`, { timeout: 10000 })
      .then( res => {

        let string = res.data.replace(/<\/p>/g, '\n');
        string = string.replace(/<p>/g, '');
        string = string.trim();
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
        this.setState({
          copyText: 'Writer is apparently suffering from writers\' block. Please check back later.',
          httpError: true
        });
      });
  }

  startCounter() {
    let timeAtStart = new Date();
    let counter = setInterval(this.timeIncrement, 1000);

    this.setState({
      counter: counter,
      finished: false,
      reset: true,
      timeStarted: true,
      startTime: timeAtStart
    });
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
    let timeAtEnd = new Date();
    let textbox = document.getElementById('typingarea');
    textbox.disabled = true;
    let timeElapsed = (timeAtEnd - this.state.startTime) /1000;
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed - (minutes * 60);
    let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
    console.log('time elapsed:', time);
    document.getElementById('restart').focus();
    let wpm = Math.round(this.state.wordCount / (timeElapsed / 60));

    let scoreData = {
      wpm: wpm,
      wordCount: this.state.wordCount,
      start: this.state.startTime,
      end: timeAtEnd,
      errors: this.state.errorCount === 1 ? 0: Math.ceil(this.state.errorCount / this.state.copyText.length * 100),
      elapsed: this.state.timeElapsed,
      perfect: this.state.errorCount === 0 ? true: false
    };
    if (this.state.userId !== undefined) {
      axios.post(`/${this.state.userId}`, scoreData);
    }
    let newHistory = [scoreData]
    newHistory = newHistory.concat(this.state.history);

    this.setState({
      wpm: wpm,
      timeElapsed: timeElapsed,
      endTime: timeAtEnd,
      finished: true,
      stopwatch: time,
      bestScore: wpm > this.state.bestScore? wpm: this.state.bestScore,
      history: newHistory
    });
  }

  checkLogin(userData) {
    // HASH THE PASSWORD
    let auth = {Authorization: `{"email": "${userData.email}", "password": "${userData.password}"}`}
    axios
      .get(`/login`, {headers: auth})
      .then((res) => {
        if (typeof res.data === 'string') {
          this.setState({
            loginWarning: res.data
          })
        } else {
          // ADD GET BEST SCORE
          this.setState({
            login: true,
            userId: res.data.id,
            history: res.data.history,
            username: res.data.username,
            loginWarning: ''
          });
          this.getText();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loginWarning: 'Incorrect email and/or password'
        })
      });
  }

  signup(userData) {
    axios
      .post(`/signup`, userData)
      .then((res) => {
        if (res.data.user_id !== undefined) {
          this.setState({
            login: true,
            userId: res.data.user_id,
            username: userData.username
          });
          this.getText();
        } else {
          this.setState({
            loginWarning: 'Email already registered'
          })
        }
      })
      .catch(() => {
        console.log(err);
        this.setState({
          loginWarning: 'Error creating account'
        })
      })
  }

  handleLogin(userData) {
    if (userData.login) {
      if (userData.username === undefined) {
        this.checkLogin(userData);
      } else {
        this.signup(userData);
      }
    } else {
      this.setState({
        login: false
      })
      this.getText();
    }
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
      this.startCounter();
    }
  }

  handleReset() {
    this.setState({
      copyText: ''
    })
    this.getText();
    clearInterval(this.state.counter);
    this.setState({
      reset: true,
      stopwatch: '0:00',
      timeElapsed: 0,
      finished: false,
      timeStarted: false,
      errorCount: 0
    })
  };

  handleErrors(errors) {
    this.setState({
      errorCount: errors
    });
  }

  handleRefresh() {
    window.location.reload();
  }

  render() {

    const timer = {
      margin: '20px 0px 5px 0px'
    }

    const loadingText = ['Generating text', 'Writing copy', 'Inventing lies', 'Wrangling letters', 'Rearranging alphabets', 'Selecting characters', 'Exploring dictionaries']

    return (
      <>
      <Login
        login={this.state.login}
        loginWarning={this.state.loginWarning}
        handleLogin={this.handleLogin}/>
      {this.state.copyText.length > 0 ? <CopyText
        copy={this.state.copyText}
        input={this.state.typedText}
        handleErrors={this.handleErrors}/>: <div className="loading">...{loadingText[Math.floor(Math.random() * loadingText.length)]}...</div>}
      {this.state.httpError ? <button id="refresh" onClick={this.handleRefresh}>Try again?</button>: null}

      <div style={timer}>
        <div role="timer">Time Elapsed: <span>{this.state.stopwatch}</span></div>
      </div>

      <TextArea
        id="typingarea"
        contenteditable
        autoFocus
        disabled
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => this.handleTyping(event) } />

      {this.state.stopwatch !== '0:00' ? <button id="restart" onClick={this.handleReset}>Restart</button>: null}

      {this.state.finished ? <Analysis
        timeElapsed={this.state.timeElapsed}
        wpm={this.state.wpm}
        copyText={this.state.copyText}
        errorCount={this.state.errorCount}
        bestScore={this.state.bestScore}/> : null}

      {this.state.history.length > 0 ? <History history={this.state.history} />: null}
    </>
    );
  }
}