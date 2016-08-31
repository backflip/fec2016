import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      trigger: 0,
      range: 0
    }

    this.handleTrigger = this.handleTrigger.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.socket = io('http://localhost:9000')

    this.socket.on('update', this.setState.bind(this))
  }

  handleTrigger () {
    this.socket.emit('setTrigger')
  }

  handleChange (event) {
    const value = event.target.value
    this.socket.emit('setRange', value)
  }

  render () {
    return <div>
      <div className="input">
        <button className="a-tr" aria-pressed={this.state.trigger ? true : false} onClick={this.handleTrigger}>a tr</button>
        <button className="a-tr" aria-pressed={this.state.trigger ? true : false} onClick={this.handleTrigger}>a tr</button>
      </div>

      <div className="input">
        <div className="slider">
          <label htmlFor="acv">aCv</label>
          <input id="acv" type="range" name="acv" min="0" max="1" step="0.01" onChange={this.handleChange} value={this.state.range} />
        </div>

        <div className="value" role="presentation">{this.state.range}</div>
      </div>

      <div className="input">
        <div className="slider">
          <label htmlFor="acv2">aCv</label>
          <input id="acv2" type="range" name="acv" min="0" max="1" step="0.01" onChange={this.handleChange} value={this.state.range} />
        </div>

        <div className="value" role="presentation">{this.state.range}</div>
      </div>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
