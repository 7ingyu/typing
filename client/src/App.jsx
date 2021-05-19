import React, { useState, useEffect } from 'react';
import TextArea from './styling/TextArea.jsx';
import Timer from './styling/Timer.jsx';
import axios from 'axios';

export default () => {
  const [stopwatch, setStopwatch] = useState('0:00');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(Infinity);
  const [btnText, setBtnText] = useState('Reset');
  const [timerStarted, setTimerStarted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [copyText, setCopyText] = useState('');
  const [reset, setReset] = useState(true);
  const [finished, setFinished] = useState(false);
  const url = 'http://localhost:1234'
  var countdown;

  const getText = () => {
    axios
      .get(`${url}/copy`)
      .then( res => {
        let string = res.data.slice(3, -4);
        setCopyText(string);
      })
      .catch( err => {
        console.log(err);
      });
  };

  const handleTyping = (event) => {

    setTypedText(event.target.value);
    setReset(false);

    // Start stopwatch
    if (stopwatch === '0:00' && event.target.value !== '') {
      setTimerStarted(true);
      let timeElapsed = 0;
      setStartTime(Date.now());
      countdown = setInterval(() => {
        if (event.target.value !== '' && !finished) {
          timeElapsed++;
          let minutes = Math.floor(timeElapsed / 60);
          let seconds = timeElapsed - (minutes * 60);
          let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
          setStopwatch(time);
        } else if (finished) {
          event.target.disabled = true;
          clearInterval(countdown);
          setEndTime(Date.now());
          timeElapsed = (endTime - startTime) / 1000; // convert to seconds
          let time = `${Math.floor(timeElapsed / 60)}:${timeElapsed - (Math.floor(timeElapsed / 60) * 60)}`
          setStopwatch(time);
          timeElapsed = 0;
          // Add saving to db of score
        } else if (reset) {
          clearInterval(countdown);
          timeElapsed = 0;
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
    setTimerStarted(false);
    setReset(true);
  };

  useEffect(() => {
    getText();
  }, []);

  const timer = {
    display: 'grid',
    gridTemplateColumns: '[timer] 20% [button] 10%',
    margin: '5px 0px'
  }

  const restart = {
  }

  return (
    <>
      <div id="copytext"><p>{copyText}</p></div>
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