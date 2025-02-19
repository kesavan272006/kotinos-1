import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function Game() {
  const dinoRef = useRef();
  const cactusRef = useRef();
  const [score, setScore] = useState(0);
  const [isopened, setIsOpened] = useState(false);

  const jump = () => {
    if (!!dinoRef.current && !dinoRef.current.classList.contains("jump")) {
      dinoRef.current.classList.add("jump");
      setTimeout(function () {
        dinoRef.current.classList.remove("jump");
      }, 300);
    }
  };

  useEffect(() => {
    if (!isopened) return;

    const isAlive = setInterval(function () {
      const dinoTop = parseInt(
        getComputedStyle(dinoRef.current).getPropertyValue("top")
      );
      let cactusLeft = parseInt(
        getComputedStyle(cactusRef.current).getPropertyValue("left")
      );

      if (cactusLeft < 40 && cactusLeft > 0 && dinoTop >= 140) {
        alert("Game Over! Your Score : " + score);
        setScore(0);
        setIsOpened(false); 
      } else {
        setScore(score + 1);
      }
    }, 10);

    return () => clearInterval(isAlive);
  }, [isopened, score]);

  useEffect(() => {
    document.addEventListener("keydown", jump);
    return () => document.removeEventListener("keydown", jump);
  }, []);

  return (
    <div>
      {isopened ? (
        <div className="game">
          <div>Score : {score}</div>
          <div id="dino" ref={dinoRef}></div>
          <div id="cactus" ref={cactusRef}></div>
        </div>
      ) : (
        <div>
          <Button onClick={() => setIsOpened(true)}>Start the game</Button>
        </div>
      )}
    </div>
  );
}

export default Game;