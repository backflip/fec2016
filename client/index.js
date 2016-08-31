import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

class Counter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      count: 0
    }

    this.handleClick = this.handleClick.bind(this)

    this.socket = io('http://localhost:9000')

    this.socket.on('update', this.setState.bind(this))
  }

  handleClick () {
    this.socket.emit('increase')
  }

  render () {
    return <button onClick={this.handleClick}>{this.state.count}</button>
  }
}

// Counter.propTypes = {
//  initialCount: PropTypes.number.isRequired
// }

ReactDOM.render(<Counter />, document.getElementById('root'))
