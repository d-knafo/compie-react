import React from 'react'
import mqtt from 'mqtt'
import { Link } from 'react-router-dom'
import { Storage } from './../storage/storage'
import { BoardBox } from './BoardBox'
import * as utils from '../utils/functions'

const client  = mqtt.connect("ws://broker.hivemq.com:8000/mqtt", {
  clientId: 'davidcompie'
});

client.on('connect', function () {

  client.subscribe('message', function (err) {
    if (!err) {
      client.publish('message', 'Hello mqtt from react')
    }
  })

  client.on('message', function (topic, message) {
     console.log(message.toString())
    // client.end()
  })
})

export class BoardMulti extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            boxes: Array(9).fill(null),
            xIsNext: true
        }
    }

    storage = new Storage()
    handleBoxClick(index) {
        const boxes = this.state.boxes.slice()

        if (utils.findWinner(boxes) || boxes[index]) {
            return
        }

        if(utils.areAllBoxesClicked(boxes) === true) {
            return
        }
        boxes[index] = this.state.xIsNext ? 'x' : 'o'

       this.setState({
            boxes: boxes,
            xIsNext: !this.state.xIsNext
        })
    }

    // Handle board restart - set component state to initial state
    handleBoardRestart = () => {
        this.setState({
            boxes: Array(9).fill(null),
            xIsNext: true
        })
    }

    render() {
    const winner = utils.findWinner(this.state.boxes)
    const isFilled = utils.areAllBoxesClicked(this.state.boxes)

    let status
        if (winner) {
            status = `The winner is: ${winner}!`
            this.storage.update([`${winner} won`])
        } else if(!winner && isFilled) {
            status = 'Game drawn!'
            this.storage.update(['Game drawn'])
        } else {
            status = `It is ${(this.state.xIsNext ? 'x' : 'o')}'s turn.`
        }

        return (
            <div>
                <Link to="/" className="board-link">Go back to scoreboard</Link>
                <br/>
                <Link to="/board" className="board-link">Go to singlePlayer</Link>
                <div className="board-wrapper">
                    <div className="board">
                        <h2 className="board-heading">{status}</h2>

                        <div className="board-row">
                            <BoardBox value={this.state.boxes[0]} onClick={() => this.handleBoxClick(0)} />
                            <BoardBox value={this.state.boxes[1]} onClick={() => this.handleBoxClick(1)} />
                            <BoardBox value={this.state.boxes[2]} onClick={() => this.handleBoxClick(2)} />
                        </div>

                        <div className="board-row">
                            <BoardBox value={this.state.boxes[3]} onClick={() => this.handleBoxClick(3)} />
                            <BoardBox value={this.state.boxes[4]} onClick={() => this.handleBoxClick(4)} />
                            <BoardBox value={this.state.boxes[5]} onClick={() => this.handleBoxClick(5)} />
                        </div>

                        <div className="board-row">
                            <BoardBox value={this.state.boxes[6]} onClick={() => this.handleBoxClick(6)} />
                            <BoardBox value={this.state.boxes[7]} onClick={() => this.handleBoxClick(7)} />
                            <BoardBox value={this.state.boxes[8]} onClick={() => this.handleBoxClick(8)} />
                        </div>
                    </div>

                    {winner && <div className="board-footer">
                        <button className="btn" onClick={this.handleBoardRestart}>Start new game</button>
                    </div>}
                </div>
          </div>
        )
    }
}
