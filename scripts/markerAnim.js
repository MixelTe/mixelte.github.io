elements.forEach((el, i) => el.movement = {
	step: {
		0: 0,
		1: 4,
		2: 7,
	}[i]
});
const Speed = 50;
const animation = createAnim();

animate();
function animate()
{
	const disableAnim = window.innerWidth < 800;
	elements.forEach((el, i) =>
	{
		if (disableAnim)
		{
			if (i == 0)
				el.marker.style.top = "260px";
			else if (i == 1)
				el.marker.style.top = "530px";
			else if (i == 2)
				el.marker.style.top = "340px";
			const step = window.innerWidth / 8;
			el.marker.style.left = `${step * i * 2 + step}px`;
			return;
		}
		el.pos = animation(el.movement, Speed);
		el.marker.style.top = `${el.pos.y}px`;
		el.marker.style.left = `${el.pos.x}px`;
	});
	requestAnimationFrame(animate);
}

function createAnim()
{
	function arc({ x, y }, start, end, radius)
	{
		return { x, y, start, end, radius };
	}

	const r = 100;
	const w = 800;
	const top = 200;
	const circles = [
		{ x: r + (w - r * 2) / 2, y: top + r },
		{ x: r + (w - r * 2) / 2 - r, y: top + r * 2.75 },
		{ x: r + (w - r * 2) / 2 + r, y: top + r * 2.75 },
		{ x: r + (w - r * 2) / 2 - r * 2, y: top + r * 4.5 },
		{ x: r + (w - r * 2) / 2, y: top + r * 4.5 },
		{ x: r + (w - r * 2) / 2 + r * 2, y: top + r * 4.5 },
	]
	circles.forEach((c, i) =>
	{
		const el = document.createElement("div");
		el.style.position = "absolute";
		el.innerText = i;
		el.style.textAlign = "center";
		el.style.top = `${c.y - r}px`;
		el.style.left = `${c.x - r}px`;
		el.style.width = `${r * 2}px`;
		el.style.height = `${r * 2}px`;
		el.style.borderRadius = "50%";
		el.style.border = "1px solid black";
		document.querySelector(".content").appendChild(el);
	})

	const animation = [
		arc(circles[5], 240, -120, r),
		arc(circles[2], 60, 180, r),
		arc(circles[1], 0, -300, r),
		arc(circles[4], -120, 180, r),
		arc(circles[3], 0, -360, r),

		arc(circles[4], 180, 300, r),
		arc(circles[2], 120, -180, r),
		arc(circles[1], 0, 300, r),
		arc(circles[0], 120, -240, r),

		arc(circles[1], -60, 60, r),
		arc(circles[4], 240, -60, r),
		arc(circles[2], -240, 60, r),
	]

	return function (state, speed)
	{
		const step = state.step || 0;
		state.step = step;
		const anim = animation[step];
		const pos = state.pos || anim.start / 180 * Math.PI;
		const x = Math.cos(pos) * anim.radius + anim.x;
		const y = Math.sin(pos) * anim.radius + anim.y;

		const speedCur = speed / (2 * anim.radius * Math.PI);
		if (anim.start < anim.end)
		{
			state.pos = pos + speedCur;
			if (state.pos >= anim.end / 180 * Math.PI)
			{
				state.step += 1;
				state.step %= animation.length;
				state.pos = animation[state.step].start / 180 * Math.PI;
			}
		}
		else
		{
			state.pos = pos - speedCur;
			if (state.pos <= anim.end / 180 * Math.PI)
			{
				state.step += 1;
				state.step %= animation.length;
				state.pos = animation[state.step].start / 180 * Math.PI;
			}
		}

		return { x, y };
	}
}