import { useEffect, useState } from "react";
import type Box from "../classes/Box";

type UseDragProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  box: Box;
};

const useDrag = ({ canvasRef, box }: UseDragProps) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [mouseDownSequence, setMouseDownSequence] = useState<boolean[]>([]);

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseDown(true);
    setMouseDownSequence((prev) => [...prev, true]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computePixelInCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.x, e.clientY - rect.y];
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return;
      const relativeCoords = computePixelInCanvas(e);
      box.x = relativeCoords[0] - box.width / 2;
    };

    const handleMouseUp = (e: MouseEvent) => {
      setMouseDown(false);
      setMouseDownSequence((prev) => [...prev, false]);
    };

    // Listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasRef, mouseDown]);

  return { mouseDown, onMouseDown, mouseDownSequence };
};

export default useDrag;
