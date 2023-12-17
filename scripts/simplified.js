{
	const simplified = new URLSearchParams(window.location.search).has("s");
	const el = document.querySelector(".simplified");
	if (simplified)
	{
		stop();
		initSimplified()
	}
	else
	{
		document.body.removeChild(el);
	}

	async function initSimplified()
	{
		const postfix = "?from=githubio";
		const hideRepos = [
			"renderer-test",
			"shri2022-performance",
			"shri_simple_template",
		]
		const switchUrl = {
			// "TextStoryGame": "https://mixelte.github.io/TextStoryGame/questEditor/",
		}
		const switchName = {
			// "TextStoryGame": "Text Story Game (editor)",
		}
		const subLinks = {
			"pages": [
				["Pages / html css js", "https://mixelte.github.io/pages/html-css-js"],
			],
			"TextStoryGame": [
				["Text Story Game / Editor", "https://mixelte.github.io/TextStoryGame/questEditor"]
			]
		}
		const list = el.querySelector(".simplified-list");
		list.appendChild(Div("Loading"))
		const repos = await (await fetch("https://api.github.com/users/mixelte/repos?per_page=200")).json();
		list.innerHTML = "";
		for (const repo of repos)
		{
			if (!repo.has_pages) continue;
			if (hideRepos.includes(repo.name)) continue;
			const url = switchUrl[repo.name] || repo.homepage || `https://mixelte.github.io/${repo.name}`;
			list.appendChild(A(switchName[repo.name] || formatName(repo.name), url + postfix))
			for (const link of subLinks[repo.name] || [])
			{
				list.appendChild(A(link[0], link[1] + postfix, 1))
			}
		}
	}

	function formatName(name)
	{
		const parts = name.includes("-") ? name.split("-") : name.split(/(?=[A-Z])/);
		return parts.map(v => v[0].toUpperCase() + v.slice(1)).join(" ");
	}

	function Div(text)
	{
		const el = document.createElement("div");
		el.innerText = text;
		return el;
	}
	function A(text, href, pad = 0)
	{
		const el = document.createElement("a");
		el.innerText = text;
		el.href = href;
		el.target = "_blank";
		el.style.marginLeft = `${pad}em`
		return el;
	}
}