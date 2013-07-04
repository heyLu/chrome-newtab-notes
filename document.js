doc_parse = function(text) {
	return {
		title: text.split('\n')[0],
		content: text
	}
}
