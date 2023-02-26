import { useState } from 'react';
import './App.css';
import File from './components/File';
import Poll from './components/Poll';

const App = () => {
  const [activeComp, setActiveComp] = useState('poll');
  return (
    <div>
      <div className='buttonContainer'>
        <button className='compButtons' onClick={() => setActiveComp('poll')}>
          Poll
        </button>
        <button className='compButtons' onClick={() => setActiveComp('text')}>
          Text
        </button>
        <button className='compButtons' onClick={() => setActiveComp('file')}>
          Upload
        </button>
      </div>
      <div className='compContainer'>{activeComp === 'poll' && <Poll />}</div>
      <div className='compContainer'>{activeComp === 'file' && <File />}</div>
    </div>
  );
};

export default App;
