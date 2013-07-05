var notesArea = document.getElementById('write');
var notificationsArea = document.getElementById('notifications');
var readme = "TODO";
notesArea.value = JSON.parse(localStorage['org.papill0n.notes.current'] || "{}").content || readme;

setInterval(function() {
	store_locally(doc_parse(notesArea.value));
}, 500);

notesArea.onkeydown = function(ev) {
	if (ev.ctrlKey && ev.keyCode == 83) { // Ctrl+s
		var storeRemoteProgress = window.setInterval(function() {
			if (notificationsArea.textContent.length < 3) {
				notificationsArea.textContent += '.';
			} else {
				notificationsArea.textContent = '.';
			}
		}, 250);
		store_remote(doc_parse(notesArea.value), function(ev) {
			if (ev.target.readyState == XMLHttpRequest.DONE) {
				window.clearInterval(storeRemoteProgress);
				if (ev.target.status == 200) {
					notificationsArea.textContent = '<3';
					notificationsArea.style.color = 'green';
				} else {
					notificationsArea.textContent = ':(';
					notificationsArea.style.color = 'red';
				}
				window.setTimeout(function() {
					notificationsArea.textContent = '';
					notificationsArea.style.color = 'black';
				}, 5000);
			}
		});
		ev.preventDefault();
	}
}
