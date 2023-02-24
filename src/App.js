import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [pollId, setPollId] = useState('');

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
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}-apCSMI4Aqlw/sendPoll`,
      {
        chat_id: process.env.REACT_APP_ChatId,
        question: question,
        options: options,
        is_anonymous: false,
        type: 'quiz',
      }
    );

    setPollId(response.data.result.poll.id);
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
      <button type='button' onClick={addOption}>
        Add Option
      </button>
      <button type='button' onClick={createPoll}>
        Create Poll
      </button>
      {pollId && (
        <div>
          <p>Your poll has been created with ID {pollId}.</p>
          <p>
            Share this link to allow people to participate: https://t.me/
            @soor_bot?start={pollId}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
