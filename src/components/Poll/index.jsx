import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { longPoll } from '../../Api';
const Poll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollId, setPollId] = useState('');
  const [result, setResult] = useState();
  const [selectedLang, setselcetedLang] = useState();

  const [selectedGroup, setselectedGroup] = useState(
    process.env.REACT_APP_ChatId_1
  );
  const [languages, setLanguages] = useState();
  const telegramRes = () => {
    longPoll((res) =>
      setResult(
        res.result
          .reverse()
          ?.find((item) => item.poll && item.poll.id === pollId)
      )
    );
  };
  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`).then((response) => {
      setLanguages(response.data);
    });
  }, []);

  const translateAll = async () => {
    let data = {
      source: 'en',
      target: selectedLang,
    };
    const quest = await axios
      .post(`https://libretranslate.de/translate`, { ...data, q: question })
      .then((response) => {
        console.log(response.data);
        return response.data.translatedText;
      });
    const opt = await Promise.all(
      options.map(async (item) => {
        let resp = await axios.post(`https://libretranslate.de/translate`, {
          ...data,
          q: item,
        });
        console.log(resp);
        return resp.data.translatedText;
      })
    );
    await axios
      .post(
        `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendPoll`,
        {
          chat_id: selectedGroup,
          question: quest,
          options: opt,
          is_anonymous: false,
          type: 'regular',
        }
      )
      .then((res) => {
        setPollId(res.data.result.poll.id);
      });
  };

  const createPoll = async () => {
    selectedLang
      ? await translateAll()
      : await axios
          .post(
            `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendPoll`,
            {
              chat_id: selectedGroup,
              question: question,
              options: options,
              is_anonymous: false,
              type: 'regular',
            }
          )
          .then((res) => {
            setPollId(res.data.result.poll.id);
          });
  };
  // console.log(selectedLang);

  return (
    <div>
      <h1>Create a Poll</h1>
      <label htmlFor='question'>Question : </label>
      <input
        type='text'
        id='question'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className='input-Container'>
        {options.map((option, index) => (
          <div key={index}>
            <label htmlFor={`option${index}`}>Option {index + 1} : </label>
            <input
              className='inputField'
              type='text'
              id={`option ${index}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e)}
            />
            <button
              type='button'
              className='remNtn'
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button className='actionbtn' type='button' onClick={addOption}>
        Add Option
      </button>
      <button className='actionbtn' type='button' onClick={createPoll}>
        Create Poll
      </button>
      <div className='LangSelector'>
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
      <div className='result-container'>
        <button onClick={() => telegramRes()} disabled={!pollId}>
          result
        </button>

        {result && (
          <div>
            <div>
              <h4>Q: {result.poll?.question}</h4>
              <p>
                {' '}
                {result.poll?.options.map((element) => (
                  <ul key={element.update_id}>
                    <li>{`${element.text}  has  ${element.voter_count} votes.`}</li>
                  </ul>
                ))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Poll;
