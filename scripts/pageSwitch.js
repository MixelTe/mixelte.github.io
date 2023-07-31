const pages = ["games", "utils", "other"];

const States = {
	hover: "on hover",
	normal: "normal",
	open: "to full screen",
	closing: "was open",
}
const NormalSize = 125;
const HoverSize = 175;

const elements = pages.map(id => ({
	page: document.getElementById("page_" + id),
	marker: document.getElementById("pageMarker_" + id),
	back: document.getElementById("back_" + id),
	state: States.normal,
	size: NormalSize,
	pos: { x: 0, y: 0 },
}));

elements.forEach(el =>
{
	el.marker.addEventListener("mouseenter", () =>
	{
		el.statePrev = el.state;
		if (el.state == States.normal)
			el.state = States.hover;
	});
	el.marker.addEventListener("mouseleave", () =>
	{
		el.statePrev = el.state;
		if (el.state == States.hover)
			el.state = States.normal;
	});
	el.marker.addEventListener("click", () =>
	{
		el.statePrev = el.state;
		el.state = States.open;
		el.page.style.zIndex = "10";
		el.page.classList.add("open");
	});
	el.back.addEventListener("click", () =>
	{
		el.statePrev = el.state;
		el.state = States.closing;
		el.page.classList.remove("open");
	});
});


updateClip();
function updateClip()
{
	elements.forEach(el =>
	{
		// const { x, y } = el.marker.getBoundingClientRect();
		const { x, y } = el.pos;
		const screenSize = Math.max(window.innerWidth, window.innerHeight);
		// el.page.style.clipPath = `circle(${el.size}px at ${x + 65 + (window.innerWidth - 800) / 2}px ${y + 65}px)`;
		el.page.style.clipPath = `circle(90px at ${x + 65 + (window.innerWidth - 800) / 2}px ${y + 65}px)`;
		if (el.state == States.hover)
		{
			el.size += 5;
			el.size = Math.min(el.size, HoverSize);
		}
		else if (el.state == States.open)
		{
			el.size += screenSize * 0.03;
			el.size = Math.min(el.size, screenSize);
		}
		else if (el.state == States.closing)
		{
			el.size -= screenSize * 0.03;
			el.size = Math.max(el.size, NormalSize);
			if (el.size == NormalSize)
			{
				el.page.style.zIndex = "1";
				el.state = States.normal;
			}
		}
		else if (el.state == States.normal)
		{
			el.size -= 3;
			el.size = Math.max(el.size, NormalSize);
		}
	});
	requestAnimationFrame(updateClip);
}
