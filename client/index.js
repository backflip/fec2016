import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      triggers: [],
      cvs: []
    }

    this.handleTrigger = this.handleTrigger.bind(this)
    this.handleCV = this.handleCV.bind(this)

    this.socket = io('http://localhost:9000')
    this.socket.on('update', this.setState.bind(this))
  }

  handleTrigger (event) {
    const id = event.target.getAttribute('id')

    this.socket.emit('setTrigger', id)
  }

  handleCV (event) {
    const id = event.target.getAttribute('id')
    const value = event.target.value

    this.socket.emit('setCV', id, value)
  }

  render () {
    return <div>
      {this.state.cvs.map((cv) => {
        let style = {
          background: 'rgba(204,58,78,' + cv.value + ')'
        }
        return <div key={cv.id} className="input">
          <div className="slider" style={style}>
            <label htmlFor={cv.id}>{cv.label}</label>
            <input id={cv.id} type="range" name={cv.id} min="0" max="1" step="0.01" onChange={this.handleCV} value={cv.value} data-init="cv" data-address={cv.address} data-module={cv.module} />
          </div>
        </div>
      })}
      <div className="input var_buttons">
        {this.state.triggers.map((trigger) => {
          return <button key={trigger.id} id={trigger.id} aria-pressed={trigger.value ? true : false} onClick={this.handleTrigger} data-init="trigger" data-address={trigger.address} data-module={trigger.module}>
            <span>{trigger.label}</span>
          </button>
        })}
      </div>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
