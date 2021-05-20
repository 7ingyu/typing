import React from 'react';

// Implement a new best feature!
export default ({ timeElapsed, wpm, copyText, errorCount, bestScore }) => {

  let errorRate = errorCount === 1 ? 0: Math.ceil(errorCount / copyText.length * 100);

  return (
    <div id="analysis">
      {wpm > bestScore ? <span style={{fontWeight: 'bold'}}>NEW HIGH SCORE! Those fingers are greased lightning!</span>: null}
      Words Per Minute: {wpm} <br/>
      Error Rate: {`${errorRate}%`} <br/>
      {errorCount === 0 ? <span style={{fontWeight: 'bold'}}>NOT A SINGLE MISTAKE!! SUCH DEXTERITY!!!</span>: null}
    </div>
  )
}