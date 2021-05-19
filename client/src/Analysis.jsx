import React from 'react';

// Implement a new best feature!
export default ({ timeElapsed, wordCount, copyText, errorCount }) => {

  let wpm = wordCount / (timeElapsed / 60);
  let errorRate = Math.round(errorCount / copyText.length * 100);

  return (
    <div id="analysis">
      Words Per Minute: {wpm} <br/>
      Error Rate: {`${errorRate}%`}
    </div>
  )
}