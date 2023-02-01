import {
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import Box from "../classes/Box";
import useDrag from "../hooks/useDrag";
import clearCanvas from "../utils/clearCanvas";

const canvasWidth = 400;
const canvasHeight = 100;

const initObject = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	objParams: Object
) => {
	return { ...objParams, canvasRef };
};

const Spring = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [playing, setPlaying] = useState(false);

	const box = useMemo(
		() =>
			new Box({
				x0: 200,
				y0: 25,
				width: 50,
				height: 50,
				canvasRef: canvasRef,
			}),
		[canvasRef]
	);

	const bungee = useMemo(
		() => ({
			x0: 0,
			y0: 50,
			width: box.x,
			height: 0,
		}),
		[box]
	);

	const { mouseDown, onMouseDown, mouseDownSequence } =
		useDrag({ canvasRef, box });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		box.playing = playing;

		let t0 = 0;

		let boxAnimation: number;

		const update = (t: number) => {
			if (!playing) {
				cancelAnimationFrame(boxAnimation);
				return;
			}
			if (t0 === 0) {
				t0 = t;
			}
			const dt = (t - t0) / 1000;
			t0 = t;
			box.move(dt);
			boxAnimation = requestAnimationFrame(update);
		};

		const reDraw = () => {
			// Resting point
			ctx.strokeStyle = "#4287f5";
			ctx.beginPath();
			ctx.setLineDash([4, 10]);
			ctx.moveTo(box.x0, 0);
			ctx.lineTo(box.x0, canvasHeight);
			ctx.stroke();

			// Reset styles
			ctx.setLineDash([]);

			// Draw Box
			box.draw();

			// Bungee
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(bungee.x0, bungee.y0);
			ctx.lineTo(box.x - box.width / 2, bungee.y0);
			ctx.stroke();
			ctx.closePath();
		};

		let secondsPassed: number;
		let oldTimeStamp: number = 0;
		let fps: number;

		let gameLoopAnimation: number;

		const gameLoop = (timeStamp: number) => {
			clearCanvas(canvasRef);

			// Calculate the number of seconds passed since the last frame
			secondsPassed = (timeStamp - oldTimeStamp) / 1000;
			oldTimeStamp = timeStamp;

			// Calculate fps
			fps = Math.round(1 / secondsPassed);

			// Draw number to the screen
			ctx.font = "16px Arial";
			ctx.fillStyle = "white";
			ctx.fillText("FPS: " + fps, canvasWidth - 100, 30);

			update(t0);
			reDraw();
			gameLoopAnimation = requestAnimationFrame(gameLoop);
		};

		gameLoop(oldTimeStamp);

		return () => {
			cancelAnimationFrame(gameLoopAnimation);
		};
	}, [canvasRef, mouseDown, playing]);

	useEffect(() => {
		if (
			mouseDownSequence[mouseDownSequence.length - 1] ===
				false &&
			mouseDownSequence[mouseDownSequence.length - 2] ===
				true
		) {
			setPlaying(true);
		}
	}, [mouseDownSequence]);

	return (
		<div>
			<div
				className="relative border border-gray-200"
				style={{ cursor: mouseDown ? "grabbing" : "grab" }}
			>
				<canvas
					onMouseDown={onMouseDown}
					ref={canvasRef}
					width={canvasWidth}
					height={canvasHeight}
				/>
			</div>
		</div>
	);
};

export default Spring;
