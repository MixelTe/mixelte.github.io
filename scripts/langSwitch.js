document.querySelectorAll("#langSwitch").forEach(btn =>
{
	btn.addEventListener("click", () =>
	{
		const ru = document.body.classList.toggle("lang-ru");
		if (history.replaceState)
		{
			var url = new URL(window.location.href);
			url.searchParams.set("l", ru ? "ru" : "en");
			window.history.replaceState(null, '', url.toString());
		}
	});
})

if (urlParams.get("l") == "ru")
{
	document.body.classList.add("lang-ru");
}