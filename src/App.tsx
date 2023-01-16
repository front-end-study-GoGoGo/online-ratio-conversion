import React from 'react';
import type { FC } from 'react';
import { Button } from 'antd';
import RatioCalculateTool from './components/RatioCalculateTool.tsx'
import './App.css';

const App: FC = () => {
  return (
    <div className="App">
      <h3>同比增减在线换算工具</h3>
      <RatioCalculateTool></RatioCalculateTool>
    </div>
  );
}

export default App;
