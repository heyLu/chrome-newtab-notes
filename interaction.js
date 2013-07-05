var notesArea = document.getElementById('write');
var readme = "TODO";
notesArea.value = JSON.parse(localStorage['org.papill0n.notes.current'] || "{}").content || readme;

setInterval(function() {
	store_locally(doc_parse(notesArea.value));
}, 500);

notesArea.onkeydown = function(ev) {
	if (ev.ctrlKey && ev.keyCode == 83) { // Ctrl+s
		store_remote(doc_parse(notesArea.value));
		ev.preventDefault();
	}
}
