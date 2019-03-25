import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null
}
  
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>
        )
    }
    render() {
        const boardRow = []
        for (let i=0; i<=2; i++) {
            const boardColumn = []
            for (let j=0; j<=2; j++) {
                boardColumn.push(this.renderSquare(3*i+j))        
            }
            boardRow.push(<div className="board-row">{boardColumn}</div>)
        }
        return (
            <div>
                <div className="board-row">
                    {boardRow}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const current = history[history.length-1]
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? "X" : "O"
        this.setState({
            history: history.concat([{
                squares: squares,
                action: i,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        const move = history.map((step, move) => {
            const rowIndex = Math.ceil((step.action+1) / 3)
            const columnIndex = Math.ceil((step.action+1) % 3) === 0 ? 3 : Math.ceil((step.action+1) % 3)
            const desc = move ? 
                "Go to move #" + move + " | Row: " + rowIndex + ", Column: " + columnIndex : 
                "Go to game start"
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        let status
        if (this.state.stepNumber === 9) {
            status = "Draw"
        } else if (winner) {
            status = "Winner: " + winner
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O")
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{move}</ol>
            </div>
        </div>
        )
    }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
  