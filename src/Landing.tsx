import hero from './assets/hero.png'
import { StateContext, states } from './App';
import { useContext } from 'react';

export function Landing() {
  const { setState } = useContext(StateContext)

  return (
    <div className='min-h-screen w-screen bg-gray-100 flex flex-col justify-center items-center'>
      <div className='h-[400px] w-[640px] bg-white rounded-lg p-2 flex justify-between'>
        <div className='space-y-2'>
          <div className='text-2xl text-blue-500'>Snake</div>
          <div className='text-sm text-gray-400'>The best selling game since 2002</div>
          <button 
            className='p-1 rounded-sm bg-blue-600 text-white hover:scale-105 cursor-pointer px-2 text-md'
            onClick={() => setState(states[1])}
          >
            Play
          </button>
        </div>

        <img src={hero} className='h-auto aspect-square' />
      </div>
    </div>
  )
}