function showMailingPopUp() {
     require(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us17.list-manage.com","uuid":"1508bdb96b4379a9aeb07c6e8","lid":"a635ea68a1"}) })
     document.cookie = "MCEvilPopupClosed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
 };
 document.getElementById("open-popup").onclick = function() {showMailingPopUp()};
