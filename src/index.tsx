import React from 'react';
import ReactDOM from 'react-dom';

interface AppProps {
  name: string;
}

const App: React.FC<AppProps> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!2</h1>
    </div>
  );
};

ReactDOM.render(<App name="world" />, document.getElementById('root'));