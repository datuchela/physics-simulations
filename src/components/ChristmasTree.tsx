import { useState } from "react";
import Decoration from "./Decoration";

type Layer = Toy[];

type Toy = {
  isOn: boolean;
  icon: string;
  color: string;
};

const numberOfLayers = 6;
const initLayers = new Array(numberOfLayers).fill(0);
initLayers.forEach((layer, index) => {
  const branch = new Array(index + 1).fill({
    isOn: true,
    icon: "*",
    color: "white",
  });
  initLayers[index] = branch;
});

function ChristmasTree() {
  const [layers, setLayers] = useState<Layer[]>(initLayers);

  return (
    <div className="flex items-center justify-center h-screen bg-slate-800">
      <div className="flex flex-col items-center text-4xl">
        <div className="flex flex-col items-center">
          {layers.map((layer, layerIndex) => (
            <div key={layerIndex} className="flex items-center gap-3">
              {layer.map((toy, toyIndex) => (
                <Decoration key={toyIndex} color={toy.color} isOn={toy.isOn}>
                  {toy.icon}
                </Decoration>
              ))}
            </div>
          ))}
        </div>
        <div className="text-white">||</div>
      </div>
    </div>
  );
}

export default ChristmasTree;
