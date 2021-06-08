import React from 'react';
import moment from 'moment';

export default (({ history }) => {

  const container = {
    background: 'white',
    padding: '0.5vw 3vw 3vw',
    marginTop: '2vw'
  }
  const box = {
    margin: '1vw 0px'
  }
  const start = {
    fontWeight: '600',
    // borderBottom: '1px solid',
    // marginBottom: '0px',
  }

  const border = {
    border: '1px solid',
    padding: '1vw'
  }
  // Implement a score deleting features
  return(
    <div id="history" style={container}>
      <h2>Previous Scores</h2>
      {history.map((score) => {
        let startTime = moment(score.start);
        return (
          <div style={box} key={startTime.format()}>
            <div style={start}>{startTime.format("dddd, MMMM Do YYYY, h:mm:ss a")}</div>
            <div style={border}>
              <div><strong>WPM: </strong>{score.wpm}</div>
              <div><strong>Error Rate: </strong>{`${score.errors}%`}
              {score.perfect ? <div><strong>** Perfect score! **</strong></div>: null}
              </div>
            </div>
          </div>
        );

      })}
    </div>
  );
})