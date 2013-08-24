var notesArea = document.getElementById('write');
var progressArea = q("#sidebar_activator");
var notesListArea = q("#notifications");
var readme = [
	"README",
	"",
	"How do I use this thing?",
	"",
	"- `configure({gist_id: '...', access_token: '...'})` in the console (`Ctrl-Shift-i`)",
	"",
	"- notes are saved automatically (but must be longer than 1 line)",
	"- choose from your notes in the lower right corner",
	"- `Ctrl-S` to save to gists",
	"",
	"<3"
].join("\n");
var currentDoc = store_get(store_current());
notesArea.value = currentDoc.content || readme;
var lastStoredContent = currentDoc.content;
document.title = currentDoc.title;

store_all().forEach(function(name) {
	notesListArea.innerHTML += "<li>" + name + "</li>";
});

setInterval(function() {
	if (lastStoredContent != notesArea.value && notesArea.value.split('\n').length != 1) {
		var doc = doc_parse(notesArea.value);
		store_locally(doc);
		document.title = doc.title;
		lastStoredContent = notesArea.value;
	}
}, 500);

notesListArea.onmousedown = function(ev) {
	store_locally(doc_parse(notesArea.value));
	var selectedDoc = ev.target.textContent;
	var doc = store_get(selectedDoc);
	notesArea.value = doc.content;
}

notesArea.onkeydown = function(ev) {
	if (ev.ctrlKey && ev.keyCode == 83) { // Ctrl+s
		var storeRemoteProgress = window.setInterval(function() {
			if (progressArea.textContent.length < 3) {
				progressArea.textContent += '.';
			} else {
				progressArea.textContent = '.';
			}
		}, 250);
		store_remote(doc_parse(notesArea.value), function(ev) {
			if (ev.target.readyState == XMLHttpRequest.DONE) {
				window.clearInterval(storeRemoteProgress);
				if (ev.target.status == 200) {
					progressArea.style.backgroundColor= 'green';
				} else {
					progressArea.style.backgroundColor = 'red';
				}
				window.setTimeout(function() {
					progressArea.style.backgroundColor = '#777';
				}, 5000);
			}
		});
		ev.preventDefault();
	}
}
