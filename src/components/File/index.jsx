import { useState, useEffect } from 'react';
import axios from 'axios';
import { longPoll } from '../../Api';
const File = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [selectedGroup, setselectedGroup] = useState(
    process.env.REACT_APP_ChatId_1
  );
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  console.log(selectedGroup);
  const sendDocument = async () => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('caption', caption);
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.REACT_APP_TOKEN}/sendDocument`,
      formData,
      {
        params: {
          chat_id: selectedGroup,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    setMessage(`File ${file.name} sent with caption "${caption}".`);
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <label htmlFor='file'>File:</label>
      <input type='file' id='file' accept='*' onChange={handleFileChange} />
      <label htmlFor='caption'>Caption:</label>
      <input
        type='text'
        id='caption'
        value={caption}
        onChange={handleCaptionChange}
      />
      <button type='button' onClick={sendDocument} disabled={!file}>
        Upload
      </button>
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default File;
