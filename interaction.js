var notesArea = document.getElementById('write');
var progressArea = q("#notifications span");
var notesListArea = q("#notifications ul");
var readme = "TODO";
notesArea.value = JSON.parse(localStorage['org.papill0n.notes.current'] || "{}").content || readme;

setInterval(function() {
	store_locally(doc_parse(notesArea.value));
}, 500);

notesArea.onkeydown = function(ev) {
	if (ev.ctrlKey && ev.keyCode == 83) { // Ctrl+s
		progressArea.style.width = '3ex';
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
					progressArea.textContent = '<3';
					progressArea.style.color = 'green';
				} else {
					progressArea.textContent = ':(';
					progressArea.style.color = 'red';
				}
				window.setTimeout(function() {
					progressArea.textContent = '';
					progressArea.style.color = 'black';
					progressArea.style.width = 'auto';
				}, 5000);
			}
		});
		ev.preventDefault();
	}
}
