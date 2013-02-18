var writeArea = document.querySelector("#write");
var lastText = "";
var req = indexedDB.open("focus-texts", 2);
var db = null;

req.onupgradeneeded = function(ev) {
	var db = ev.target.result;
	var objectStore = db.createObjectStore("texts", { keyPath: "name" });
	console.log("created text database");
	objectStore.add({"name" : "current-text", "text" : ""});
}

req.onsuccess = function(ev) {
	db = ev.target.result;
	var objectStore = db.transaction(["texts"], "readwrite").objectStore("texts");
	var req = objectStore.get("current-text");
	req.onsuccess = function(ev) {
		console.log(ev.target.result);
		lastText = writeArea.value = ev.target.result.text;
	}
}

req.onerror = console.log.bind(console);

setInterval(function() {
	var newData = { "name" : "current-text", "text" : writeArea.value };
	if (lastText == newData.text) {
		return;
	} else {
		lastText = newData.text;
		var objectStore = db.transaction(["texts"], "readwrite").objectStore("texts");
		var req = objectStore.put(newData);
		req.onerror = console.log.bind(console);
	}
}, 500);
