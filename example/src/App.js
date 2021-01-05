import React from 'react';
import { StreamStoreProvider } from './store';
import { StreamPublisher, StreamSubscriber, StreamWrapper } from './components';

function App() {
  return (
      // create context store for janus data used in components
    <StreamStoreProvider>
      <div className="container">
        {/*stream wrapper component; creates janus instance*/}
        <StreamWrapper>
          <div className="stream-publisher">
            <h4>Publisher</h4>
            {/*publisher component*/}
            <StreamPublisher />
          </div>
          <hr />
          <div className="stream-subscriber mt-16">
            <h4>Subscriber</h4>
            {/*subscriber component*/}
            <StreamSubscriber />
          </div>
        </StreamWrapper>
      </div>
    </StreamStoreProvider>
  );
}

export default App;
