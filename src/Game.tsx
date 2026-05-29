import { useContext, useEffect, useState } from "react"
import { states, StateContext } from "./App"
import { useGame } from "./hooks/useGame";
import { Snake } from './GameLogic/Snake'

interface GrassProps {
  r: number;
  c: number;
  hasApple: boolean;
}

function whatColor(r: number, c: number): string {
  if (r % 2 == 0) {
    return c % 2 == 0 ? 'light' : 'dark';
  } else {
    return c % 2 == 0 ? 'dark' : 'light';
  }
}

function GrassCell({ r, c, hasApple }: GrassProps) {
  const color = whatColor(r, c) === 'light' ? 'bg-green-300' : 'bg-green-500';
  return (
    <div className={`${color} text-red-500 flex flex-col justify-center items-center text-3xl`}>
      <div>
        {hasApple ? '•' : ''}
      </div>
    </div>
  )
}

interface SnakeProps {
  isHead?: boolean
  rotation?: number;
  hasApple: boolean;
}

function getAngle(dx: number, dy: number): number {
  if (dx === 0 && dy === 1) {
    return 0;
  } else if (dx === 1 && dy === 0) {
    return 90;
  } else if (dx === 0 && dy === -1) {
    return 180;
  } else {
    return 270;
  }
}

function SnakeCell({ isHead, rotation, hasApple }: SnakeProps) {
  return (
    <div className='bg-blue-500 text-red-500 justify-center items-center text-3xl relative'>
      {isHead &&
        <div 
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          style={{
            transform: `rotate(${rotation!}deg)`
          }}
        >
          →
        </div>
      }
      <div>
        {hasApple ? '•' : ''}
      </div>
    </div>
  )
}

function cellToRender(r: number, c: number, game: Snake) {
  if (game.isSnakeCell(r, c)) {
    const isHead = (r === game.snakePos[0][0] && c === game.snakePos[0][1]) ? true : undefined;
    const rotation = (isHead) ? getAngle(game.currDir[0], game.currDir[1]) : undefined
    return (
      <SnakeCell 
        isHead={isHead}
        rotation={rotation}
        hasApple={r === game.applePos[0] && c === game.applePos[1]} 
      />
    )
  } else {
    return <GrassCell r={r} c={c} hasApple={r === game.applePos[0] && c === game.applePos[1]} />
  }
}

export function Game() {
  const { setState } = useContext(StateContext);
 
  const [started, setStarted] = useState<boolean>(false);

  const { gameRef, reset } = useGame();
  const game = gameRef.current;

  function startGame() {
    setStarted(true);
    game.startGame();
  }

  function banner() {
    if (gameRef.current.gameOver && !gameRef.current.isWin()) {
      return (
        <div className='text-red-500 text-2xl'>Game Over</div>
      )
    } else if (gameRef.current.gameOver && gameRef.current.isWin()) {
      return (
        <div className='text-green-500 text-2xl'>You win</div>
      )
    } else {
      return null;
    }
  }

  function body() {
    if (!started) {
      return (
        <button 
          className='bg-blue-400 text-2xl text-white rounded-sm px-3 py-1 text-xl cursor-pointer hover:scale-105'
          onClick={startGame}
        >
          Start
        </button>
      )
    } else {
      const arr = Array.from({ length: game.R * game.C })
      return (
        <div 
          className='grid gap-0'
          style={{
            gridTemplateRows: `repeat(${game.R}, 36px)`,
            gridTemplateColumns: `repeat(${game.C}, 36px)`
          }}
        >
          {arr.map((_, i) => {
            const r = Math.floor(i / game.R), c = i % game.C;
            return cellToRender(r, c, game);
          })}
        </div>
      )
    }
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
          game.changeDir(-1, 0);
          break;

        case 'a':
          game.changeDir(0, -1);
          break;;

        case 's':
          game.changeDir(1, 0);
          break;

        case 'd':
          game.changeDir(0, 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKey);
    
    return () => window.removeEventListener('keydown', handleKey);
  }, [game]);

  return (
    <div className='min-h-screen w-screen grid grid-rows-[64px_1fr]'>
      <div className='[grid-area:1/1/2/-1] bg-blue-300 px-3 flex justify-between items-center gap-2 '>
        <div 
          className='bg-blue-500 px-3 py-1 text-white rounded-sm text-3xl'
        >
          Score: {game.score}
        </div>

        {banner()}
        
        <div className='space-x-2'>
          {started &&
            <>
              <button 
                className='w-8 h-8 rounded-sm bg-white hover:scale-105 cursor-pointer'
                onClick={() => (game.paused) ? game.unpause() : game.pause()}
              >
              {game.paused ? '▶︎' : '⏸︎'}
              </button>

              <button 
                className='px-2 py-1 rounded-sm bg-white text-red-500 hover:scale-105 cursor-pointer'
                onClick={() => {
                  reset();
                  setStarted(false);
                }}
              >
                ↻
              </button>
            </>
          }

          <button 
            className='px-2 py-1 rounded-sm bg-white hover:scale-105 cursor-pointer'
            onClick={() => setState(states[0])}
          >
            Back
          </button>
        </div>
      </div>

      <div className='[grid-area:2/1/-1/-1] flex flex-col justify-center items-center'>
       {body()}
      </div>
    </div>
  )
}