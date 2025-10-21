import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: '',
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const res = await axios.get('/api/values/current');
      const data = res.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        this.setState({ values: data });
      } else {
        this.setState({ values: {} }); // received HTML or something unexpected
      }
    } catch {
      this.setState({ values: {} });
    }
  }

  async fetchIndexes() {
    try {
      const res = await axios.get('/api/values/all');
      const data = res.data;
      const arr = Array.isArray(data) ? data
       : Array.isArray(data?.rows) ? data.rows 
       : []; 
      this.setState({
        seenIndexes: arr
      });
    } catch (err) {
      this.setState({ seenIndexes: [] });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {
      index: this.state.index,
    });
    this.setState({ index: '' });
  };

  renderSeenIndexes() {
    const list = Array.isArray(this.state.seenIndexes) ? this.state.seenIndexes : [];
    return list.map(({ number }) => number).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(event) => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
