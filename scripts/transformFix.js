function  tranformFix()
{
	document.body.style.setProperty("--tranformFixX", (document.body.clientWidth % 2 == 0 ? 0 : 0.5) + "px");
	document.body.style.setProperty("--tranformFixY", (document.body.clientHeight % 2 == 0 ? 0 : 0.5) + "px");
}
tranformFix()
setInterval(tranformFix, 1500);