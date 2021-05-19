import React, { useState, useEffect } from 'react';
import CopyText from './CopyText.jsx';
import Timer from './styling/Timer.jsx';
import TextArea from './styling/TextArea.jsx';

import axios from 'axios';

export default () => {
  const [stopwatch, setStopwatch] = useState('0:00');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(Infinity);
  const [typedText, setTypedText] = useState('');
  const [copyText, setCopyText] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [reset, setReset] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const url = 'http://localhost:1234'
  var countdown;

  const getText = () => {
    axios
      .get(`${url}/copy`)
      .then( res => {
        let string = res.data.slice(3, -5);
        let count = string.split(' ').length;
        setCopyText(string);
        setWordCount(count);
      })
      .catch( err => {
        console.log(err);
      });
  };

  const handleTyping = (event) => {

    setTypedText(event.target.value);
    setReset(false);

    // End Game
    if (typedText.length >= copyText.length) {
      setEndTime(Date.now());
      setFinished(true);
      let textbox = document.getElementById('typingarea');
      textbox.disabled = true;
      // Focus to restart btn
      // Post results to db
    }

    // Start stopwatch
    if (stopwatch === '0:00' && event.target.value !== '') {
      let timeElapsed = 0;
      setStartTime(Date.now());
      countdown = setInterval(() => {
        if (event.target.value !== '' && !finished) {
          timeElapsed++;
          let minutes = Math.floor(timeElapsed / 60);
          let seconds = timeElapsed - (minutes * 60);
          let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
          setStopwatch(time);
        } else if (finished || reset) {
          clearInterval(countdown);
        }
      }, 1000);
    }
  };

  const handleReset = () => {
    let textbox = document.getElementById('typingarea');
    textbox.value = '';
    textbox.disabled = false;
    textbox.focus();
    setStopwatch('0:00');
    setFinished(false);
    setReset(true);
  };

  const handleErrors = (errors) => {
    setErrorCount(errors);
  }

  useEffect(() => {
    getText();
  }, []);

  const timer = {
    display: 'grid',
    gridTemplateColumns: '[timer] 20% [button] 10%',
    margin: '5px 0px'
  }

  return (
    <>
      {copyText.length > 0 ? <CopyText
        copy={copyText}
        input={typedText}
        handleErrors={handleErrors}/>: null}
      <div style={timer}>
        <div role="timer">Time Elapsed: <span>{stopwatch}</span></div>
        {stopwatch !== '0:00' ? <button onClick={handleReset}>Restart</button>: null}
        </div>
      <TextArea
        id="typingarea"
        contenteditable
        autoFocus
        placeholder="Type here!"
        onChange={ event => handleTyping(event) } />
    </>
  );
};