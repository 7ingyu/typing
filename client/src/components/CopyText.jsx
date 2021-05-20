import React from 'react';

export default ({copy, input, handleErrors}) => {

  let copyArr = copy.split('');
  let inputArr = input.split('');

  const copytext = {
    background: 'white',
    padding: '3vw'
  }

  const waiting = {
    color: 'unset'
  };
  const correct = {
    color: 'green'
  };
  const wrong = {
    color: 'red',
    textDecoration: 'underline'
  };

  let errors = 0;

  return (
    <div id="copytext" style={copytext}>
    {copyArr.map((char, index) => {
      if (inputArr[index] === undefined) {
        return char === '\n' ? <span key={index} style={waiting}>{char}<br/><br/></span>: <span key={index} style={waiting}>{char}</span>
      } else if (char === inputArr[index] || char === '\n' || char === '\r') {
        return char === '\n' ? <span key={index} style={correct}>{char}<br/><br/></span>: <span key={index} style={correct}>{char}</span>
      } else if (char !== inputArr[index]) {
        errors++;
        console.log(inputArr[index], 'should be', char)
        handleErrors(errors);
        return char === '\n' ? <span key={index} style={wrong}>{char}<br/><br/></span>: <span key={index} style={wrong}>{char}</span>
      }
    })}
    </div>
  );
};