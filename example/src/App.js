import React from 'react';
import { StreamStoreProvider } from './store';
import { StreamPublisher, StreamSubscriber, StreamWrapper } from './components';

function App() {
  return (
    <StreamStoreProvider>
      <div className="container">
        <StreamWrapper>
          <div className="stream-publisher">
            <h4>Publisher</h4>
            <StreamPublisher />
          </div>
          <hr />
          <div className="stream-subscriber mt-16">
            <h4>Subscriber</h4>
            <StreamSubscriber />
          </div>
        </StreamWrapper>
      </div>
    </StreamStoreProvider>
  );
}

export default App;
