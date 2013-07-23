mk_slug = function(s) {
	return s.toLowerCase().replace(/\s/g, "_").replace(/a-z0-9-_/g, "");
}

document_create = function(text) {
	var doc = {};
	var first_newline = text.indexOf("\n");
	doc.title = text.slice(0, first_newline || text.length);
	doc.content = text;
	doc.version = 0;
	doc.slug = mk_slug(doc.title);
	return doc;
}

document_save = function(doc, new_version) {
	if (new_version) {
		doc.version += 1;
	} else if (!window.localStorage[doc.slug + "_vMAX"]) {
		var all_slugs = JSON.parse(window.localStorage["org.papill0n.all_docs"] || "[]");
		all_slugs.push(doc.slug);
		window.localStorage["org.papill0n.all_docs"] = JSON.stringify(all_slugs);
	}
	var id = doc.slug + "_v" + doc.version;
	window.localStorage[id] = JSON.stringify(doc);
	if (new_version || window.localStorage[doc.slug + "_vMAX"] == undefined) {
		window.localStorage[doc.slug + "_vMAX"] = doc.version;
	}
}

document_load = function(doc_slug, version) {
	version = version || document_most_recent_version(doc_slug);
	var doc_json = window.localStorage[doc_slug + "_v" + version];
	if (doc_json == undefined) {
		return null;
	} else {
		return JSON.parse(doc_json);
	}
}

document_load_all_versions = function(doc_slug) {
	var maxVersion = document_most_recent_version(doc_slug);
	if (maxVersion == -1) {
		return [];
	} else {
		var docs = [];
		for (var version = 0; version <= maxVersion; version++) {
			docs.push(document_load(doc_slug, version));
		}
		return docs;
	}
}

document_most_recent_version = function(doc_slug) {
	var maxVersion = parseInt(window.localStorage[doc_slug + "_vMAX"]);
	if (isNaN(maxVersion)) {
		return -1;
	} else {
		return maxVersion;
	}
}

document_load_all = function() {
	var docs = [];
	var all_slugs = JSON.parse(window.localStorage["org.papill0n.all_docs"] || "[]");
	for (var i = 0; i < all_slugs.length; i++) {
		var doc = document_load(all_slugs[i], document_most_recent_version(all_slugs[i]));
		if (doc != null) {
			docs.push(doc);
		}
	}
	return docs;
}
