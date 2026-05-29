import { useRef, useState } from "react";
import { Snake } from "../GameLogic/Snake";

export function useGame() {
  const [_, setUpdate] = useState<boolean>(false);
  const gameRef = useRef<Snake>(new Snake(tick));

  function tick() { setUpdate(t => !t)}

  function reset() {
    gameRef.current = new Snake(() => setUpdate(t => !t));
    tick();
  }

  return {
    gameRef,
    tick,
    reset,
  }
}