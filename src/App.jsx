import { useSelector } from 'react-redux'
import GameBoard from './components/GameBoard'
import Header from './components/header/Header'

export default function App() {
  const { isGameOver } = useSelector((state) => state.game)
  return (
    <main>
      <Header />
      <GameBoard />
      {isGameOver && <div className="game-over-message">Has perdido</div>}
    </main>
  )
}
