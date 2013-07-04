req=function(params){var xhr=new XMLHttpRequest();xhr.open(params.verb||'GET', params.url);for(name in params.headers||[]){xhr.setRequestHeader(name, (params.headers||[])[name])};cb=console.log.bind(console);xhr.onerror=params.error||cb;xhr.onreadystatechange=params.cb||cb;return xhr};

mkparams=function(params){var param_str="";for (key in params){var sep=param_str==""?"?":"&";param_str+=sep+key+"="+params[key]};return param_str}
