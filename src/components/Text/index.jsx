import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { longPoll } from '../../Api';
const Text = () => {
  const [text, setText] = useState(null);
  const [result, setResult] = useState();
  const [selectedLang, setselcetedLang] = useState();
  const [languages, setLanguages] = useState();
  const [selectedGroup, setselectedGroup] = useState(
    process.env.REACT_APP_ChatId_1
  );
  const telegramRes = () => {
    longPoll((res) =>
      setResult(
        res.result.filter(
          (item) =>
            item.message &&
            !item.message?.document &&
            item.message.chat.id == selectedGroup
        )
      )
    );
  };
  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`).then((response) => {
      setLanguages(response.data);
    });
  }, []);

  const sendMessage = async () => {
    if (selectedLang) {
      let data1 = {
        q: text,
        source: 'en',
        target: selectedLang,
      };
      const transText = await axios
        .post(`https://libretranslate.de/translate`, { ...data1, q: text })
        .then((response) => {
          console.log(response.data);
          return response.data.translatedText;
        });
      const url = `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendMessage`;
      const data = {
        chat_id: selectedGroup,
        text: transText,
      };
      await axios
        .post(url, data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    } else {
      const url = `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendMessage`;
      const data = {
        chat_id: selectedGroup,
        text: text,
      };
      await axios
        .post(url, data)
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className='textContainer'>
      <h1>Request a Text</h1>
      <p>ask a question</p>

      <input type='text' onChange={(e) => setText(e.target.value)} />
      <button type='button' className='actionbtn' onClick={sendMessage}>
        Request
      </button>
      <div className='selectDiv'>
        <div className='languagecontainer'>
          Language:
          <select
            className='selectfield'
            name='language'
            onChange={(e) => {
              setselcetedLang(e.target.value);
            }}
          >
            {languages &&
              languages?.map((item) => (
                <option value={item.code}>{item.name}</option>
              ))}
          </select>
        </div>
        <div className='languagecontainer'>
          Group:
          <select
            className='selectfield'
            name='groupName'
            onChange={(e) => {
              setselectedGroup(e.target.value);
            }}
          >
            <option value={process.env.REACT_APP_ChatId_1}>Bot test</option>
            <option value={process.env.REACT_APP_ChatId_2}>Bot Test 2</option>
          </select>
        </div>
      </div>
      <button className='resultBtn' onClick={() => telegramRes()}>
        Result
      </button>
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
