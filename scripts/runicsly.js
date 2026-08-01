const runicsly_btn = document.getElementById("runicsly_btn");
const runicsly_btn_parent = runicsly_btn.parentElement;

let started = false;
runicsly_btn.addEventListener("click", async () =>
{
	if (started) return;
	started = true;

	runicsly_btn.classList.add("_runicsly_btn_shake")
	// await wait(1000);

	setTimeout(async () =>
	{
		const container = document.createElement("div");
		document.body.appendChild(container);
		const MaxD = Math.max(document.body.clientHeight, document.body.clientWidth);
		for (let i = 0; i < 150; i++)
		{
			await wait(10);
			for (let j = 0; j < 2; j++)
			{
				const rect = runicsly_btn_parent.getBoundingClientRect();
				const x = rect.left + rect.width / 2;
				const y = rect.top + rect.height / 2;
				container.style.setProperty("--x", `${x}px`);
				container.style.setProperty("--y", `${y}px`);

				const a = Math.random() * Math.PI * 2;
				const d = Math.random() * MaxD + 300;
				const dx = Math.cos(a) * d;
				const dy = Math.sin(a) * d;
				const size = Math.random() * 5 + 2;

				const el = document.createElement("div");
				el.style.position = "fixed";
				el.style.top = "var(--y)";
				el.style.left = "var(--x)";
				el.style.transform = `translate(${dx}px, ${dy}px)`;
				el.style.width = `${size}px`;
				el.style.height = `${size}px`;
				el.style.opacity = 0;
				el.style.zIndex = "1000";
				el.style.pointerEvents = "none";
				el.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
				el.style.borderRadius = "50%";
				el.style.transition = "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.24, -0.03, 0.67, 1.19)";
				container.appendChild(el);

				setTimeout(() =>
				{
					el.style.opacity = 1;
					el.style.transform = "translate(0, 0)";
				}, 50);
				setTimeout(() =>
				{
					el.style.opacity = 0;
				}, 1200);
				setTimeout(() =>
				{
					el.remove();
				}, 1500)
			}
		}
		for (let i = 0; i < 30; i++)
		{
			const rect = runicsly_btn_parent.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			container.style.setProperty("--x", `${x}px`);
			container.style.setProperty("--y", `${y}px`);
			await wait(50);
		}
		document.body.removeChild(container);
	})

	const els = [];
	for (let i = 0; i < 3; i++)
	{
		if (i > 0) await wait(500);
		for (let j = 0; j < (i + 1) * 2; j++)
		{
			const rect = runicsly_btn_parent.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;
			const bg = document.createElement("div");
			els.push(bg);
			bg.style.position = "fixed";
			bg.style.top = "0";
			bg.style.left = "0";
			bg.style.width = "100vw";
			bg.style.height = "100vh";
			bg.style.zIndex = "1000";
			bg.style.pointerEvents = "none";

			bg.style.setProperty("--radius", "-3%");
			bg.style.background = `radial-gradient(circle at ${x}px ${y}px, transparent calc(var(--radius) - 5%), darkviolet var(--radius), transparent calc(var(--radius) + 2%)`;
			bg.style.transition = "--radius 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

			document.body.appendChild(bg);
			await wait(125);
			bg.style.setProperty("--radius", "120%");
		}
	}
	await wait(200);

	const rect = runicsly_btn_parent.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	const bg = document.createElement("div");
	els.push(bg);
	bg.style.position = "fixed";
	bg.style.top = "0";
	bg.style.left = "0";
	bg.style.width = "100vw";
	bg.style.height = "100vh";
	bg.style.zIndex = "1000";
	bg.style.pointerEvents = "none";

	bg.style.setProperty("--radius", "-2%");
	bg.style.background = `radial-gradient(circle at ${x}px ${y}px, darkviolet var(--radius), transparent calc(var(--radius) + 2%)`;
	bg.style.transition = "--radius 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)";

	document.body.appendChild(bg);
	await wait(125);
	bg.style.setProperty("--radius", "120%");

	await wait(1500);
	bg.style.opacity = "0";
	document.body.classList.toggle("runicsly_imp")

	await wait(500);
	bg.remove();
	els.forEach(el => el.remove());
	runicsly_btn.classList.remove("_runicsly_btn_shake");
	started = false;
});

async function wait(t)
{
	return new Promise(r => setTimeout(r, t));
}