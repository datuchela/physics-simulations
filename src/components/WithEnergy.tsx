import { useEffect, useRef } from "react";
import clearCanvas from "../utils/clearCanvas";
import Circle from "../classes/Circle";

export const canvasWidth = 400;
export const canvasHeight = 100;

const WithEnergy = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ball1 = new Circle({
    name: "ball1",
    fill: "#ff6745",
    radius: 32,
    mass: 1,
    x0: 32,
    y0: 32 + 16,
    vx: 1,
    vy: 0,
  });

  const ball2 = new Circle({
    name: "ball2",
    fill: "#5145ff",
    radius: 32,
    mass: 1.2,
    x0: 300,
    y0: 32 + 16,
    vx: 0,
    vy: 0,
  });

  const balls = [ball1, ball2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let secondsPassed: number;
    let oldTimeStamp: number = 0;
    let fps: number;

    const gameLoop = (timeStamp: number) => {
      clearCanvas(canvasRef);

      // Calculate the number of seconds passed since the last frame
      secondsPassed = (timeStamp - oldTimeStamp) / 1000;
      oldTimeStamp = timeStamp;

      // Calculate fps
      fps = Math.round(1 / secondsPassed);

      balls.forEach((ball) => {
        ball.move(secondsPassed);
        ball.detectWalls();
        const filteredBalls = balls.filter((predicate) => predicate.name !== ball.name);
        ball.handleCollision(filteredBalls);
        // ball.handleSpring(filteredBalls);
        ball.draw(ctx);
      });

      // Draw number to the screen
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("FPS: " + fps, 64, 30);

      requestAnimationFrame(gameLoop);
    };

    gameLoop(oldTimeStamp);
  }, [canvasRef]);

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas
        ref={canvasRef}
        className="border border-gray-200"
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default WithEnergy;
