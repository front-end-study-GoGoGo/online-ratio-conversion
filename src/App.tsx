import React from 'react';
import RatioCalculateTool from './components/RatioCalculateTool'
import './App.less';

const App: React.FC = () => {
  return (
    <div className="App">
      <h3>同比增减在线换算工具</h3>
      <RatioCalculateTool></RatioCalculateTool>
    </div>
  );
}

export default App;