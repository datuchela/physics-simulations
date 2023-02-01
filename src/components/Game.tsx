import { useEffect, useMemo, useRef, useState } from "react";
import imgClosedUrl from "../assets/temo-closed.jpg";
import imgOpenUrl from "../assets/temo-open.jpg";

type DirectionVector = [number, number];

const canvasWidth = 720;
const canvasHeight = 500;

const playerWidth = 64;
const playerHeight = 64;

// time interval
const dt = 2;

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const temoClosedRef = useRef<HTMLImageElement>(null);
  const [img, setImg] = useState(imgClosedUrl);

  const player = {
    img: img,
    width: playerWidth,
    height: playerHeight,
    x: canvasWidth / 2 - playerWidth / 2,
    y: canvasHeight / 2 - playerHeight / 2,
    acceleration: 5,
    speed: 5,
    dx: 0,
    dy: 0,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawPlayer = () => {
      const temoImage = temoClosedRef.current;
      if (!temoImage) return;
      ctx.drawImage(temoImage, player.x, player.y, player.width, player.height);
    };

    const detectWalls = () => {
      // Left wall
      if (player.x < 0) {
        player.x = 0;
      }
      // Right wall
      if (player.x + player.width > canvasWidth) {
        player.x = canvasWidth - player.width;
      }
      // Ceiling
      if (player.y < 0) {
        player.y = 0;
      }
      // Floor
      if (player.y + player.height > canvasHeight) {
        player.y = canvasHeight - player.height;
      }
    };

    const gravity = () => {
      const g = 0.98;
      player.y = player.y + player.dy + (g / 2) * dt * dt;
    };

    const jump = () => {
      player.y = player.y + player.dy - (player.acceleration / 2) * dt * dt;
    };

    const move = (direction: DirectionVector) => {
      player.dx = direction[0] * player.speed;
      player.dy = direction[1] * player.speed;
      player.x += player.dx;
      player.y += player.dy;
    };

    const clear = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    type KeyState = {
      KeyW?: boolean;
      KeyA?: boolean;
      KeyS?: boolean;
      KeyD?: boolean;
      ArrowUp?: boolean;
      ArrowLeft?: boolean;
      ArrowDown?: boolean;
      ArrowRight?: boolean;
      Space?: boolean;
    };

    const keyState: KeyState = {};

    function keyStateHandler(keyState: KeyState) {
      // if (keyState["KeyW"] || keyState["ArrowUp"]) {
      //   move([0, -1]);
      // }
      if (keyState["KeyA"] || keyState["ArrowLeft"]) {
        move([-1, 0]);
      }
      if (keyState["KeyS"] || keyState["ArrowDown"]) {
        move([0, 1]);
      }
      if (keyState["KeyD"] || keyState["ArrowRight"]) {
        move([1, 0]);
      }
      if (keyState["Space"]) {
        setImg(imgOpenUrl);
        jump();
      }
    }

    function gameLoop() {
      clear();
      detectWalls();
      gravity();
      keyStateHandler(keyState);
      drawPlayer();
      move([0, 0]);

      setTimeout(() => requestAnimationFrame(gameLoop), dt);
    }

    gameLoop();

    function handleKeyDown(e: KeyboardEvent) {
      keyState[e.code as keyof KeyState] = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
      keyState[e.code as keyof KeyState] = false;
    }

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [canvasRef, temoClosedRef]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-xl text-white">move with WASD or Arrows</h1>
      <h1 className="text-xl text-white">
        Press <span className="text-red-200">Space</span> to {`(o 👄 o)`}
      </h1>
      <canvas
        ref={canvasRef}
        className="border border-gray-200"
        width={canvasWidth}
        height={canvasHeight}
      />
      <img
        className="hidden"
        ref={temoClosedRef}
        src={player.img}
        alt="temo closed"
        width={playerWidth}
        height={playerHeight}
      />
    </div>
  );
};

export default Game;
