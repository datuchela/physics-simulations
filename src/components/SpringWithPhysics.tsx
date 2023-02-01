import { useEffect } from "react";
import SpringPhysics from "../classes/SpringPhysics";

const SpringWithPhysics = () => {
	useEffect(() => {
		const spring = new SpringPhysics({
			mass: 1,
			stiffness: 0.2,
			x0: 0,
		});

		spring.x = 20;

		let dt;
		let t0 = 0;

		const update = (dt: number) => {
			spring.animate();
			console.log(spring.x);
		};

		const gameLoop = (t: number) => {
			dt = (t - t0) / 1000; // in seconds
			t0 = t;

			update(dt);

			requestAnimationFrame(gameLoop);
		};

		// gameLoop(t0);
	}, []);

	return <div className="p-2 text-white">hello</div>;
};

export default SpringWithPhysics;
