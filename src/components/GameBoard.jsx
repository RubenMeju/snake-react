import React, { useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { moveSnake, changeDirection } from '../store/reducers/gameSlice'

function GameBoard() {
  const requestRef = useRef()
  const lastUpdateTimeRef = useRef(0)
  const progressTimeRef = useRef(0)
  const dispatch = useDispatch()

  const { isRunning, board, speed } = useSelector((state) => state.game)

  const update = (time) => {
    requestRef.current = requestAnimationFrame(update)
    if (!isRunning) {
      return
    }
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = time
    }
    const deltaTime = time - lastUpdateTimeRef.current
    progressTimeRef.current += deltaTime
    if (progressTimeRef.current > speed) {
      dispatch(moveSnake())
      progressTimeRef.current = 0
    }
    lastUpdateTimeRef.current = time
  }

  const handleKeyPress = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowUp':
          dispatch(changeDirection('UP'))
          break
        case 'ArrowDown':
          dispatch(changeDirection('DOWN'))
          break
        case 'ArrowLeft':
          dispatch(changeDirection('LEFT'))
          break
        case 'ArrowRight':
          dispatch(changeDirection('RIGHT'))
          break
        default:
          break
      }
    },
    [dispatch]
  )

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update)

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRunning, handleKeyPress])

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`cell ${
                cell === 1 ? 'snake' : cell === 2 ? 'food' : ''
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default GameBoard
