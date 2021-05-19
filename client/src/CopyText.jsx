import React from 'react';

export default ({copy, input, handleErrors}) => {

  let copyArr = copy.split('');
  let inputArr = input.split('');

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
    <div id="copytext">
    {copyArr.map((char, index) => {
      if (inputArr[index] === undefined) {
        return <span key={index} style={waiting}>{char}</span>
      } else if (char === inputArr[index]) {
        return <span key={index} style={correct}>{char}</span>
      } else if (char !== inputArr[index]) {
        handleErrors(++errors);
        return <span key={index} style={wrong}>{char}</span>
      }
    })}
    </div>
  );
};