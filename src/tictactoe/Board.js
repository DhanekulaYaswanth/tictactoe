import React, { useState, useEffect } from "react";
import './Board.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faUserGroup, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

function Board() {
    const [squares, setsquares] = useState(Array(9).fill(null));
    const [turn, setturn] = useState(null);
    const [chances, setChances] = useState(null);

    const[winner,setwinner] = useState(null);
    const [winnerarea,setwinnerarea] = useState([]);
    const [points,setpoints] = useState([0,0,0]);
    const [audioplay,setaudioplay] = useState(true);

    const [mode,setmode] = useState(0)

    useEffect(()=>{
        if(winnerarea.length!==0){
            for (let i = 1; i <= 9; i++) {
                const element = document.getElementById(i.toString());
                if (winnerarea.includes(i - 1)) {
                    element.classList.add('blink'); // Add the blink class to winning squares
                } else {
                    element.classList.add('gray'); // Add the gray class to non-winning squares
                }
            }
            
        }
        
    },[winner])



    const classRemover = () =>{
            for (let i = 1; i <= 9; i++) {
                const element = document.getElementById(i.toString());
                element.classList.remove('pop')
                if (winnerarea.includes(i - 1)) {
                    element.classList.remove('blink'); // Add the blink class to winning squares
                } else {
                    element.classList.remove('gray'); // Add the gray class to non-winning squares
                }
            }
            
    }

    function shuffleArray() {
        const array = ['X', 'O']
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


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
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                setwinnerarea(lines[i])
                return turn; // Returns the player number who won
            }
        }

        if (squares.every(square => square !== null)) {
            return 'tie'; // Returns 'tie' if all squares are filled and no winner
        }

        return null; // Returns null if there's no winner yet
    }



    function calculateAIWinner(squares) {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }

      const playSound = (e) => {
        const audio1 = require('./Sounds/one.wav');
        const audio2 = require('./Sounds/two.wav');
        const win = require('./Sounds/win.wav');
        const tie = require('./Sounds/tie.mp3');
        var audio;
        if(e==='win'){
            audio = new Audio(win); 
        }
        else if(e==='tie'){
            audio = new Audio(tie);
        }
        else{
            audio = new Audio(turn===1?audio1:audio2);
        }
        if(audioplay)
        audio.play();
    };


    function isBoardFilled(squares) {
        for (let i = 0; i < squares.length; i++) {
          if (squares[i] === null) {
            return false;
          }
        }
        return true;
      }


    function findBestSquare(squares, player) {
        // 'player' is the maximizing player
        // 'opponent' is the minimizing player
        const opponent = player === 'X' ? 'O' : 'X';
        
        const minimax = (squares, isMax) => {
          const winner = calculateAIWinner(squares);
          
          // If player wins, score is +1
          if (winner === player) return { square: -1, score: 1 };
          
          // If opponent wins, score is -1
          if (winner === opponent) return { square: -1, score: -1 };
          
          // If Tie, score is 0
          if (isBoardFilled(squares)) return { square: -1, score: 0 };
          
          // Initialize 'best'. If isMax, we want to maximize score, and minimize otherwise.
          const best = { square: -1, score: isMax ? -1000 : 1000 };
          
          // Loop through every square on the board
          for (let i = 0; i < squares.length; i++) {
            // If square is already filled, it's not a valid move so skip it
            if (squares[i]) {
              continue;
            }
            
            // If square is unfilled, then it's a valid move. Play the square.
            squares[i] = isMax ? player : opponent;
            // Simulate the game until the end game and get the score,
            // by recursively calling minimax.
            const score = minimax(squares, !isMax).score;
            // Undo the move
            squares[i] = null;
      
            if (isMax) {
              // Maximizing player; track the largest score and move.
              if (score > best.score) {
                best.score = score;
                best.square = i;
              }
            } else {
              // Minimizing opponent; track the smallest score and move.
              if (score < best.score) {
                best.score = score;
                best.square = i;
              }
            }
          }
          
          // The move that leads to the best score at end game.
          return best;
        };
        
        // The best move for the 'player' given current board
        return minimax(squares, true).square;
      }


    
      const handleComputerMove = () => {
        let ind = findBestSquare([...squares], chances[1]);
        handleSquare(ind + 1); // Adding 1 because indices start from 1 in your code
    };
    
    
    
    
    
    

    

    const handleSquare = (e) => {
        let win;
        if (turn === null) {
            setturn(1);
        } else if(winner===null) {
            document.getElementById(String(e)).classList.add('pop')

            const [player1, player2] = chances;

            const data = squares.slice(); // Make a copy of squares

            if (data[e - 1] === null && winner === null) { // to make the move if the value is not presented in the index and winner is not yet declared
                
                setturn(turn === 1 ? 2 : 1);//changing the player turn

                data[e - 1] = turn === 1 ? player1 : player2; //setting the value based on the player turn

                win = calculateWinner(data);//caluculates winner based on modified square
                setsquares(data);
                playSound();
            }



            //to caluculate winner
    
            if (win === 'tie') {
                playSound('tie');
                setwinner(0);
                let t = [...points];
                t[0]+=1
                setpoints(t);
            } else if (win) {
                playSound('win');
                setwinner(win);
                let t = [...points];
                t[win]+=1
                setpoints(t);
            }
        }


        if (squares.every(square => square !== null) || winner!==null) {
            classRemover();
            setsquares(Array(9).fill(null)); // Reset squares when the game ends
            setChances(shuffleArray()); // Reshuffle chances for the next game
            setturn(null);
            setwinner(null);
            setwinnerarea([]);
        }
    }


    useEffect(()=>{
        setTimeout(() => {
            if(mode===0 && turn===2 && winner===null){
                handleComputerMove(squares)
            }
        }, 500);
    },[mode,turn])




    const changeMode = () =>{
        classRemover();
        setmode(mode===0?1:0)
        setsquares(Array(9).fill(null)); // Reset squares when the game ends
        setChances(shuffleArray()); // Reshuffle chances for the next game
        setturn(null);
        setwinner(null);
        setwinnerarea([]);
        setpoints([0,0,0])
    }
    

    useEffect(() => {
        setChances(shuffleArray()); // Shuffle chances when component mounts
    }, []);


    return (
        <div className="outerboard">
            <label onClick={()=>{setaudioplay(!audioplay)}} className="audio"><label className={audioplay?"":"audioff"}/><FontAwesomeIcon icon={faVolumeHigh}/></label>
            <h1 className="turn">
                {
                    winner === 0 ? 'It\'s a tie' :
                        winner === 1 ? 'Player 1 won the Game' :
                            winner === 2 ? 'Player 2 won the Game' :
                                turn === 1 ? 'Player 1\'s turn' :
                                    turn === 2 ? mode===0?'Computer\'s turn':'Player 2\'s turn' :
                                        ''
                }
            </h1>
            <div className="board">
                <section className={winner===0?'blinkborder rows':'rows'}>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(1) }}><label id="1">{squares[0]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(2) }}><label id='2'>{squares[1]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(3) }}><label id='3'>{squares[2]}</label></label>
                </section>
                <section className={ winner===0?'blinkborder rows':'rows'}>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(4) }}><label id='4'>{squares[3]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(5) }}><label id='5'>{squares[4]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(6) }}><label id='6'>{squares[5]}</label></label>
                </section>
                <section className={winner===0?'blinkborder rows':'rows'}>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(7) }}><label id='7'>{squares[6]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(8) }}><label id='8'>{squares[7]}</label></label>
                    <label className={winner===0?"buttons gray borderleftblink" : "buttons"} onClick={() => { handleSquare(9) }}><label id='9'>{squares[8]}</label></label>
                </section>
            </div>
            <div className="points">
                <table className="table">
                            <tbody>
                                <tr>
                                    <th className={turn===1 || turn===null?"playertitle":"playertitle gray"}>
                                        Player 1({chances!==null? chances[0] : ''})
                                    </th>
                                    <th className="playertitle">
                                        Tie
                                    </th>
                                    <th className={turn===2 || turn===null?"playertitle":"playertitle gray"}>
                                        {mode===0?'Computer':'Player 2'}({chances!==null? chances[1] : ''})
                                    </th>
                                    <th rowSpan={2} className="playertitle players" onClick={()=>changeMode()}>
                                        <label ><FontAwesomeIcon icon={mode===0?faUser:faUserGroup}/></label>
                                        <br/>
                                        <label>{mode===0?'1P':'2P'}</label>
                                    </th>
                                </tr>

                                <tr>
                                    <td className={turn===1 || turn===null?"playertitle":"playertitle gray"}>
                                        {points[1]}
                                    </td>
                                    <td className="playertitle">
                                        {points[0]}
                                    </td>
                                    <td className={turn===2 || turn===null?"playertitle":"playertitle gray"}>
                                        {points[2]}
                                    </td>

                                </tr>
                            </tbody>
                </table>
            </div>
        </div>
    )
}

export default Board;
