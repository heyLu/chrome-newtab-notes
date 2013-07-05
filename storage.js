store_all = function() {
	var notes = [];
	var isDoc = function(key) { return ["settings", "current"].every(function(el) { return 'org.papill0n.notes.' + el != key }) };
	for (name in localStorage) {
		if (isDoc(name)) {
			notes.push(name.substring('org.papill0n.notes.'.length));
		}
	}
	return notes;
}

store_current = function() {
	return localStorage['org.papill0n.notes.current'] || 'README';
}

store_get = function(title) {
	return JSON.parse(localStorage['org.papill0n.notes.' + title] || '{}');
}

store_locally = function(doc) {
	localStorage['org.papill0n.notes.current'] = doc.title;
	localStorage['org.papill0n.notes.' + doc.title] = JSON.stringify(doc);
}

store_remote = function(doc, cb) {
	if (!localStorage['org.papill0n.notes.settings']) {
		alert('you need to configure() before saving remotely');
		return;
	}
	var settings = JSON.parse(localStorage['org.papill0n.notes.settings']);
	req({
		verb: 'POST',
		url: "https://api.github.com/gists/"
			+ settings.gist_id
			+ mkparams({access_token: settings.access_token}),
		cb: cb
	}).send(JSON.stringify(gist_from_doc(doc)));
}

gist_from_doc = function(doc) {
	var gist = {files: {}};
	gist.files[doc.title] = {content: doc.content};
	return gist;
}

configure = function(settings) {
	localStorage['org.papill0n.notes.settings'] = JSON.stringify(settings);
}
