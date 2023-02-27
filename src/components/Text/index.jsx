import React, { useState } from 'react';
import axios from 'axios';

import { longPoll } from '../../Api';
const Text = () => {
  const [text, setText] = useState(null);
  const [result, setResult] = useState();
  const telegramRes = () => {
    longPoll((res) =>
      setResult(
        res.result.filter((item) => item.message && !item.message?.document)
      )
    );
  };
  console.log(result);
  const sendMessage = () => {
    const url = `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendMessage`;
    const data = { chat_id: process.env.REACT_APP_ChatId_1, text };
    axios
      .post(url, data)
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
  };

  return (
    <div className='textContainer'>
      <h1>Request a Text</h1>
      <p>ask the question</p>

      <input type='text' onChange={(e) => setText(e.target.value)} />
      <button type='button' className='actionbtn' onClick={sendMessage}>
        Request
      </button>
      <button onClick={() => telegramRes()}>Result</button>
      {result?.length > 0 &&
        result.map((item) => (
          <div key={item?.message_id}>
            <h4>
              {` ${item?.message?.from?.first_name} ${
                item?.message?.from?.last_name
                  ? item?.message?.from?.last_name
                  : ''
              } `}
            </h4>
            <p>{item?.message?.text}</p>
          </div>
        ))}
    </div>
  );
};

export default Text;
