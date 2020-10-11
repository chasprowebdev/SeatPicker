import React, { Component } from 'react';
import logo from './logo.svg';
import SeatPicker from './components/SeatPicker';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = { message: '' };
  }

  render() {
    return (
      <div className="App">
        <SeatPicker />
      </div>
    );
  }
}

export default App;
