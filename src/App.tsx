import Game from "./components/Game";
import Collisions from "./components/Collisions";
import WithEnergy from "./components/WithEnergy";
import Spring from "./components/Spring";
import SpringWithPhysics from "./components/SpringWithPhysics";

function App() {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-800">
			<h3 className="mb-6 text-center text-white">
				Please, take this demonstration as a grain of salt,
				it still has bugs in it. <br /> This is just me,
				trying to refresh my memory on how physics work in
				programming.
			</h3>
			{/* <Game /> */}
			{/* <Collisions/> */}
			{/* <WithEnergy /> */}
			<Spring />
			{/* <SpringWithPhysics /> */}
		</div>
	);
}

export default App;
