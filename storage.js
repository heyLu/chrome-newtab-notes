store_locally = function(doc) {
	localStorage['org.papill0n.notes.current'] = JSON.stringify(doc);
}

store_remote = function(doc) {
	if (!localStorage['org.papill0n.notes.settings']) {
		alert('you need to configure() before saving remotely');
		return;
	}
	var settings = JSON.parse(localStorage['org.papill0n.notes.settings']);
	req({
		verb: 'POST',
		url: "https://api.github.com/gists/"
			+ settings.gist_id
			+ mkparams({access_token: settings.access_token})
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
