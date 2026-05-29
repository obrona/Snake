import { createContext, useState } from 'react'
import './App.css'
import { Landing } from './Landing'
import { Game } from './Game'

export const states = ['landing', 'game'];

interface StateContext {
  setState: (s: string) => void;
}

export const StateContext = createContext<StateContext>({
    setState: (_: string) => {}
});

function App() {
  const [state, setState] = useState<string>(states[0]);

  return (
    <StateContext value={{setState: setState}}>
      {state === states[0] && <Landing />}
      {state === states[1] && <Game />}
    </StateContext>
  )
}

export default App
