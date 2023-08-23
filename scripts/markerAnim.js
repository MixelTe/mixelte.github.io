elements.forEach((el, i) => el.movement = {
	i,
	start: {
		0: 0,
		1: 90,
		2: 360 + 360 + 180,
	}[i]
});
const Speed = 15;
// const Speed = 0;
const animation = createAnim();

animate();
function animate()
{
	const disableAnim = window.innerWidth < 800;
	if (isOpen)
	{
		const open = elements.find(el => el.state == States.open || el.state == States.opening);
		page_index.scrollTop = open.page.scrollTop;
	}
	else
		elements.forEach((el, i) =>
		{
			if (disableAnim)
			{
				if (i == 0)
					el.pos.y = 280;
				else if (i == 1)
					el.pos.y = 650;
				else if (i == 2)
					el.pos.y = 420;
				const step = window.innerWidth / 8;
				el.pos.x = step * i * 2 + step;
			}
			else
			{
				let speed = Speed;
				if (i != 2) speed *= (2 + 1 / 1.5) / 6;
				if (i == 2) speed *= -1;
				el.pos = animation(el.movement, speed);
				el.pos.x -= el.markerSize.w / 2;
				el.pos.y -= el.markerSize.h / 2;
			}

			el.pos.y -= page_index.scrollTop;
			el.page.scrollTop = page_index.scrollTop;

			el.marker.style.top = `${el.pos.y}px`;
			el.marker.style.left = `${el.pos.x}px`;
		});
	requestAnimationFrame(animate);
}

function createAnim()
{
	function arc({ x, y }, start, end, radius, speed = 1)
	{
		return { x, y, start, end, radius, speed };
	}

	const r = 110;
	const w = 800;
	const top = 150;
	const circle = (x, y) => ({ x: (w - r * 6) / 2 + r * 2 * x + r, y: top + r * 2 * y + r });
	function drawCircles()
	{
		[
			circle(0, 0),
			circle(0, 1),
			circle(0, 2),
			circle(1, 0),
			circle(1, 1),
			circle(1, 2),
			circle(2, 0),
			circle(2, 1),
			circle(2, 2),
		].forEach((c, i) =>
		{
			const el = document.createElement("div");
			el.style.position = "absolute";
			// el.innerText = i;
			// el.style.textAlign = "center";
			el.style.top = `${c.y - r}px`;
			el.style.left = `${c.x - r}px`;
			el.style.width = `${r * 2}px`;
			el.style.height = `${r * 2}px`;
			el.style.borderRadius = "50%";
			el.style.border = "1px solid black";
			document.querySelector(".content").appendChild(el);
		});
	}
	// drawCircles();

	const animations = [
		[
			arc(circle(0, 1), 180, 0, r),
			arc(circle(1, 1), -180, 0, r, 1.5),
			arc(circle(2, 1), 180, -180, r),
			arc(circle(1, 1), 0, 180, r, 1.5),
			arc(circle(0, 1), 0, -180, r),
		],
		[
			arc(circle(1, 0), 270, 90, r),
			arc(circle(1, 1), -90, 90, r, 1.5),
			arc(circle(1, 2), 270, 90, r),
			arc(circle(1, 2), 90, -90, r),
			arc(circle(1, 1), -270, -90, r, 1.5),
			arc(circle(1, 0), 90, -90, r),
		],
		[
			arc(circle(0, 0), 225, 90, r, 0.75),
			arc(circle(0, 1), -90, 90, r),
			arc(circle(0, 2), 270, 0, r, 0.75),
			arc(circle(1, 2), -180, 0, r),
			arc(circle(2, 2), 180, -90, r, 0.75),
			arc(circle(2, 1), 90, 270, r),
			arc(circle(2, 0), 90, -180, r, 0.75),
			arc(circle(1, 0), 0, 180, r),
			arc(circle(0, 0), 0, -135, r, 0.75),
		],
	]

	return function (state, speed)
	{
		const animation = animations[state.i];
		if (!isFinite(state.step))
		{
			let p = 0;
			let i = 0;
			let anim = animation[i];
			while (p < state.start)
			{
				anim = animation[i];
				// p += 2 * anim.radius * Math.PI * Math.abs(anim.start - anim.end) / 360;
				p += Math.abs(anim.start - anim.end);
				if (p >= state.start)
				{
					p -= Math.abs(anim.start - anim.end);
					break;
				}
				i = (i + 1) % animation.length;
			}
			state.step = i;
			// state.pos = (anim.start / 180 * Math.PI) + ((p - state.start) * (anim.start < anim.end ? 1 : -1)) / (2 * anim.radius * Math.PI);
			state.pos = (anim.start + (state.start - p) * (anim.start < anim.end ? 1 : -1)) / 180 * Math.PI;
		}
		const step = state.step;
		const anim = animation[step];
		const pos = state.pos ?? anim.start / 180 * Math.PI;
		const x = Math.cos(pos) * anim.radius + anim.x;
		const y = Math.sin(pos) * anim.radius + anim.y;

		let start = anim.start;
		let end = anim.end;
		let toNext = () =>
		{
			state.step += 1;
			state.step %= animation.length;
			state.pos = animation[state.step].start / 180 * Math.PI;
		}
		if (speed < 0)
		{
			[start, end] = [end, start];
			speed *= -1;
			toNext = () =>
			{
				state.step -= 1;
				state.step = (state.step + animation.length) % animation.length;
				state.pos = animation[state.step].end / 180 * Math.PI;
			}
		}
		const speedCur = speed / (2 * anim.radius * Math.PI) * anim.speed;
		if (start < end)
		{
			state.pos = pos + speedCur;
			if (state.pos >= end / 180 * Math.PI)
				toNext();
		}
		else
		{
			state.pos = pos - speedCur;
			if (state.pos <= end / 180 * Math.PI)
				toNext();
		}

		return { x, y };
	}
}