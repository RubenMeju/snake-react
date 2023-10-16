import { useDispatch, useSelector } from 'react-redux'
import { pause, restart, resume } from '../../store/reducers/gameSlice'
import './styles.css'
export default function Header() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game)
  const { isRunning, gameOver, score } = game

  return (
    <header>
      <section className="buttons">
        <button
          className="btn"
          onClick={(e) => {
            if (gameOver) {
              return
            }
            if (isRunning) {
              dispatch(pause())
            } else {
              dispatch(resume())
            }
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          className="btn"
          onClick={(e) => {
            dispatch(restart())
          }}
        >
          Restart
        </button>
      </section>

      <p className="text-score">
        Score: <span>{score}</span>
      </p>
    </header>
  )
}
