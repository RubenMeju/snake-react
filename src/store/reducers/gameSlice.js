import { createSlice } from '@reduxjs/toolkit'

const boardSize = 25

const initialState = {
  isRunning: false,
  paused: false,
  resume: false,
  restart: false,
  board: Array(boardSize)
    .fill(0)
    .map(() => Array(boardSize).fill(0)),
  snake: [{ x: 5, y: 5 }],
  food: { x: 2, y: 2 },
  direction: 'RIGHT',
  speed: 200,
  score: 0,
  hasEatenFood: false
}
function updateBoard(state) {
  // Borro el rastro de la serpiente en el tablero (establece a 0).
  for (let row = 0; row < state.board.length; row++) {
    for (let col = 0; col < state.board[row].length; col++) {
      state.board[row][col] = 0
    }
  }

  // pongo la serpiente en el tablero (establece a 1).
  for (const segment of state.snake) {
    if (
      segment.x >= 0 &&
      segment.x < boardSize &&
      segment.y >= 0 &&
      segment.y < boardSize
    ) {
      state.board[segment.x][segment.y] = 1
    }
  }

  // pongo la comida en el tablero (establece a 2).
  state.board[state.food.x][state.food.y] = 2
}

export const gameSlice = createSlice({
  name: 'gameStatus',
  initialState,
  reducers: {
    pause: (state) => {
      state.isRunning = false
      state.paused = true
    },
    resume: (state) => {
      state.isRunning = true
      state.paused = false
    },
    restart: (state) => {
      window.location.reload()
    },
    checkGameOver: (state) => {
      // Compruebo si la cabeza de la serpiente está fuera de los límites de la matriz.
      const head = state.snake[0]
      if (
        head.x < 0 ||
        head.x >= boardSize ||
        head.y < 0 ||
        head.y >= boardSize
      ) {
        state.isGameOver = true
      }
    },
    moveSnake: (state) => {
      // Obtengo la posición actual de la cabeza de la serpiente.
      const head = state.snake[0]

      // Calculo la nueva posición de la cabeza en función de la dirección actual.
      const newHead = { ...head }

      switch (state.direction) {
        case 'UP':
          newHead.y -= 1
          break
        case 'DOWN':
          newHead.y += 1
          break
        case 'LEFT':
          newHead.x -= 1
          break
        case 'RIGHT':
          newHead.x += 1
          break
        default:
          break
      }

      // Verifico si la cabeza de la serpiente ha alcanzado la comida.
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        // La serpiente ha comido la comida, así que no eliminamos la cola.
        state.hasEatenFood = true
        // Genero nueva comida en una ubicación aleatoria.
        state.food.x = Math.floor(Math.random() * boardSize)
        state.food.y = Math.floor(Math.random() * boardSize)
        // Aumentar el marcador.
        state.score += 1
      } else {
        // Si no ha comido, elimino la cola de la serpiente.
        state.hasEatenFood = false
        state.snake.pop()
      }

      // Verifico si la cabeza de la serpiente está fuera de los límites de la matriz.
      if (
        newHead.x < 0 ||
        newHead.x >= boardSize ||
        newHead.y < 0 ||
        newHead.y >= boardSize
      ) {
        state.isGameOver = true
        // Puedes detener el juego aquí o realizar otras acciones cuando el juego se detiene.
      } else {
        // Verifico si la cabeza de la serpiente se superpone con alguna parte de su propio cuerpo.
        for (let i = 1; i < state.snake.length; i++) {
          if (
            newHead.x === state.snake[i].x &&
            newHead.y === state.snake[i].y
          ) {
            state.isGameOver = true
            // Puedes detener el juego aquí o realizar otras acciones cuando el juego se detiene.
            return
          }
        }

        // Si la serpiente no está fuera de los límites ni choca consigo misma, agregamos la nueva cabeza.
        state.snake.unshift(newHead)
      }

      // Actualizar la matriz
      updateBoard(state)
    },

    changeDirection: (state, action) => {
      const newDirection = action.payload

      // Verifico si la nueva dirección es opuesta a la dirección actual.
      if (
        (newDirection === 'UP' && state.currentDirection === 'DOWN') ||
        (newDirection === 'DOWN' && state.currentDirection === 'UP') ||
        (newDirection === 'LEFT' && state.currentDirection === 'RIGHT') ||
        (newDirection === 'RIGHT' && state.currentDirection === 'LEFT')
      ) {
        // No permitir el cambio de dirección opuesta.
        return
      }

      // Cambiar la dirección solo si no es opuesta a la actual.
      state.direction = newDirection
      state.currentDirection = newDirection
    }
  }
})

export const {
  pause,
  resume,
  restart,
  checkGameOver,
  moveSnake,
  changeDirection
} = gameSlice.actions
export default gameSlice.reducer
