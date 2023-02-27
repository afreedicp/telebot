import React, { useState } from 'react';
import axios from 'axios';
import { longPoll } from '../../Api';
const File = () => {
  const [text, setText] = useState(null);
  const [result, setResult] = useState();
  const telegramRes = () => {
    longPoll((res) =>
      setResult(
        res.result.filter(
          (item) =>
            (item.message && item.message?.document) || item.message?.photo
        )
      )
    );
  };
  const imageCon = (item) => {
    const base64String = item;
    const blob = new Blob([atob(base64String)], { type: 'image/png' });
    const imageUrl = URL.createObjectURL(blob);
  };

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
      <h1>File uploader</h1>
      <p> what file to upload ?</p>
      <input type='text' onChange={(e) => setText(e.target.value)}></input>
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
            <p className='docContainer'>
              {item?.message?.document
                ? item?.message?.document?.file_name
                : item?.message?.photo.map((el) => (
                    <li
                      className='imageCont'
                      onClick={() => imageCon(el.file_id)}
                    >
                      {el.file_id}
                    </li>
                  ))}
            </p>
          </div>
        ))}
    </div>
  );
};

export default File;
