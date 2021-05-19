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
  const [copyText, setCopyText] = useState({});
  const [finished, setFinished] = useState(false);
  const url = 'http://localhost:1234'
  var countdown;

  const getText = () => {
    axios
      .get(`${url}/copy`)
      .then( res => {
        setCopyText(res.data);
      })
      .catch( err => {
        console.log(err);
      });
  };

  const handleTyping = (event) => {

    setTypedText(event.target.value);

    // Start stopwatch
    if (stopwatch === '0:00' && event.target.value !== '') {
      setTimerStarted(true);
      let timeElapsed = 0;
      setStartTime(Date.now());
      countdown = setInterval(() => {
        if (event.target.value !== '' || !finished) {
          timeElapsed++;
          let minutes = Math.floor(timeElapsed / 60);
          let seconds = timeElapsed - (minutes * 60);
          let time = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`
          setStopwatch(time);
        } else {
          event.target.disabled = true;
          clearInterval(countdown);
          setEndTime(Date.now());
          timeElapsed = (endTime - startTime) / 1000; // convert to seconds
          let time = `${Math.floor(timeElapsed / 60)}:${timeElapsed - (Math.floor(timeElapsed / 60) * 60)}`
          setStopwatch(time);
          timeElapsed = 0;

          // Add saving to db of score
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
  };

  const createMarkup = () => {
    return {__html: copyText};
  }

  useEffect(() => {
    getText();
  }, []);

  return (
    <>
      <div id="copytext" dangerouslySetInnerHTML={createMarkup()}></div>
      <div role="timer">Time Elapsed: {stopwatch}</div>
      <TextArea
        id="typingarea"
        autoFocus
        placeholder="Type here!"
        spellCheck="false"
        onChange={ event => handleTyping(event) } />
      {stopwatch !== '0:00' ? <button onClick={handleReset}>Restart</button>: null}
    </>
  );
};