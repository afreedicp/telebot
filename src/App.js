import { useState } from 'react';

import './App.css';
import File from './components/File';
import Poll from './components/Poll';
import Text from './components/Text';

const App = () => {
  const [activeComp, setActiveComp] = useState('poll');

  return (
    <>
      <div>
        <div className='buttonContainer'>
          <button
            className={`compButtons ${activeComp === 'poll' && 'active'}`}
            onClick={() => {
              setActiveComp('poll');
            }}
          >
            Poll
          </button>
          <button
            className={`compButtons ${activeComp === 'text' && 'active'}`}
            onClick={() => setActiveComp('text')}
          >
            Text
          </button>
          <button
            className={`compButtons ${activeComp === 'file' && 'active'}`}
            onClick={() => setActiveComp('file')}
          >
            Upload
          </button>
        </div>
        {activeComp === 'poll' ? (
          <div className='compContainer'>
            <Poll />
          </div>
        ) : activeComp === 'file' ? (
          <div className='compContainer'>
            <File />
          </div>
        ) : (
          <div className='compContainer'>
            <Text />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
