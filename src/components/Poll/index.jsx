import { useState } from 'react';
import axios from 'axios';
import './styles.css';
import { longPoll } from '../../Api';
const Poll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollId, setPollId] = useState('');
  const [result, setResult] = useState();
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

  const createPoll = async () => {
    const response = await axios
      .post(
        `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendPoll`,
        {
          chat_id: process.env.REACT_APP_ChatId_1,
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
  // console.log(result);
  return (
    <div>
      <h1>Create a Poll</h1>
      <label htmlFor='question'>Question:</label>
      <input
        type='text'
        id='question'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((option, index) => (
        <div key={index}>
          <label htmlFor={`option${index}`}>Option {index + 1}:</label>
          <input
            type='text'
            id={`option${index}`}
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
      <button className='actionbtn' type='button' onClick={addOption}>
        Add Option
      </button>
      <button className='actionbtn' type='button' onClick={createPoll}>
        Create Poll
      </button>
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
