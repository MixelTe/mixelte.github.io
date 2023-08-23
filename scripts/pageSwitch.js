const pages = ["games", "utils", "other"];

const States = {
	hover: "on hover",
	normal: "normal",
	opening: "to full screen",
	open: "is full screen",
	closing: "was open",
}
const NormalSize = 125;
const HoverSize = 175;
let isOpen = false;
const page_index = document.getElementById("page_index");

const elements = pages.map(id => ({
	id,
	page: document.getElementById("page_" + id),
	marker: document.getElementById("pageMarker_" + id),
	back: document.querySelectorAll(`#back_${id}`),
	state: States.normal,
	size: NormalSize,
	pos: { x: 0, y: 0 },
	markerSize: { w: 130, h: 130 },
}));

elements.forEach((el, i) =>
{
	el.marker.addEventListener("mouseenter", () =>
	{
		if (el.state == States.normal)
			el.state = States.hover;
	});
	el.marker.addEventListener("mouseleave", () =>
	{
		if (el.state == States.hover)
			el.state = States.normal;
	});
	el.marker.addEventListener("click", () =>
	{
		el.state = States.opening;
		el.page.style.zIndex = "10";
		el.page.classList.add("open");
		isOpen = true;
		if (history.replaceState)
		{
			var url = new URL(window.location.href);
			url.searchParams.set("p", pages[i]);
			window.history.replaceState(null, '', url.toString());
		}
	});
	el.back.forEach(btn => btn.addEventListener("click", () =>
	{
		el.state = States.closing;
		el.page.classList.remove("open");
		isOpen = false;
		document.body.classList.remove("pageOpened");
		if (history.replaceState)
		{
			var url = new URL(window.location.href);
			url.searchParams.delete("p");
			window.history.replaceState(null, '', url.toString());
		}
	}));
});

const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get("p");
if (pages.includes(page))
{
	const openPage = elements[pages.indexOf(page)];
	openPage.state = States.open;
	openPage.page.style.zIndex = "10";
	openPage.page.classList.add("open");
	document.body.classList.add("pageOpened");
	isOpen = true;
	const screenSize = Math.max(window.innerWidth, window.innerHeight) * Math.SQRT2;
	openPage.size = screenSize;
}


updateClip(0);
function updateClip(t)
{
	if (!markerAnimEnabled && t != 0)
	{
		requestAnimationFrame(updateClip);
		return;
	}
	const anyOpen = elements.some(el => el.state == States.open);
	elements.forEach(el =>
	{
		// const { x, y } = el.marker.getBoundingClientRect();
		const { x, y } = el.pos;
		const { w, h } = el.markerSize;
		const screenSize = Math.max(window.innerWidth, window.innerHeight) * Math.SQRT2;
		const dx = page_index.clientWidth >= 800 ? (page_index.clientWidth - 800) / 2 : 0;
		if (!anyOpen)
		{
			el.page.style.clipPath = `circle(${el.size}px at ${x + w / 2 + dx}px ${y + h / 2}px)`;
			// el.page.style.clipPath = `circle(90px at ${x + 65 + (window.innerWidth - 800) / 2}px ${y + 65}px)`;
		}
		if (el.state == States.hover)
		{
			el.size += 5;
			el.size = Math.min(el.size, HoverSize);
		}
		else if (el.state == States.opening)
		{
			el.size += screenSize * 0.03;
			el.size = Math.min(el.size, screenSize);
			if (el.size == screenSize)
			{
				el.state = States.open;
				document.body.classList.add("pageOpened");
			}
		}
		else if (el.state == States.open)
		{
			el.page.style.clipPath = "none";
			el.size = screenSize;
		}
		else if (el.state == States.closing)
		{
			el.size -= screenSize * 0.03;
			el.size = Math.max(el.size, NormalSize);
			if (el.size == NormalSize)
			{
				el.page.style.zIndex = el.id == "games" ? "2" : "1";
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
