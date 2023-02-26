import { useState } from 'react';
import axios from 'axios';
import './styles.css';
const Poll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollId, setPollId] = useState('');
  const [pollMsgId, setPollMsgId] = useState(0);
  const [pollResults, setPollResults] = useState(null);

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
        setPollMsgId(res.data.result.message_id);
        //    setTimeout(() => {
        // endPoll();
        //    }, 5000);
        //    const endPoll = async () => {
        //      const response = await axios.post(
        //        `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/stopPoll`,
        //        {
        //          message_id: res.data.result.message_id,
        //          chat_id: process.env.REACT_APP_ChatId_1,
        //        }
        //      );
        //      console.log(response.data);
        //    };
      });
  };

  const getPollResults = async () => {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/getPollResult`,
      {
        chat_id: process.env.REACT_APP_ChatId_1,
        poll_id: pollId,
        message_id: pollMsgId,
      }
    );
    if (response.data.ok) {
      const result = response.data.result;
      if (result.is_closed && result.total_voter_count >= 2) {
        console.log(result.options); // array of poll options with votes count
      } else {
        console.log('Poll has not ended or has less than 2 participants.');
      }
    } else {
      console.log('Failed to get poll result.');
    }

    setPollResults(response.data.result);
  };

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
      {pollId && (
        <div>
          <p>Your poll has been created with ID {pollId}.</p>
          <button type='button' onClick={() => getPollResults()}>
            Get Poll Results
          </button>
          {pollResults && (
            <div>
              {pollResults.options.map((option, index) => (
                <div key={index}>
                  <p>{option.text}</p>
                  <p>Votes: {option.voter_count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Poll;
