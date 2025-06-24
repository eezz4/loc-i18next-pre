const defaults = {
    selectorAttr: 'data-i18n',
    targetAttr: 'i18n-target',
    optionsAttr: 'i18n-options',
    preTranslateAttr: 'data-i18n-pre',
    insertTagName: 'loc-i18n',
    useOptionsAttr: false,
    parseDefaultValueFromContent: true,
    // `document` if running inside a browser, but otherwise undefined (prevents reference error when ran outside browser)
    document: typeof window !== 'undefined' ? document : undefined,
};

function init(i18next, options={}){
    options = { ...defaults, ...options };
    var extendDefault = (o, val) => options.parseDefaultValueFromContent
                                    ? { ...o, ...{ defaultValue: val } } : o;
    function parse(elem, key, opts){
        var attr = 'text';

        if(key.indexOf('[') == 0){
            var parts = key.split(']');
            key = parts[1];
            attr = parts[0].substr(1, parts[0].length - 1);
        }

        key = key.indexOf(';') == key.length - 1
            ? key.substr(0, key.length - 2)
        	  : key;

        const openingTag = `<${options.insertTagName}>`;
        const closingTag = `</${options.insertTagName}>`;

        if (attr === 'html') {
            elem.innerHTML = i18next.t(key, extendDefault(opts, elem.innerHTML));
        } else if(attr === 'text') {
            elem.textContent = i18next.t(key, extendDefault(opts, elem.textContent));
        } else if(attr === 'prepend') {
            let startIdx = elem.innerHTML.indexOf(openingTag);
            let endIdx = elem.innerHTML.indexOf(closingTag) + 11;
            if (startIdx > -1 && endIdx > 6) {
                elem.innerHTML = [elem.innerHTML.substring(0, startIdx), elem.innerHTML.slice(endIdx)].join('')
            }
            elem.innerHTML = [openingTag, i18next.t(key, extendDefault(opts, elem.innerHTML)), closingTag, elem.innerHTML].join('');
        } else if(attr === 'append') {
            let startIdx = elem.innerHTML.indexOf(openingTag);
            let endIdx = elem.innerHTML.indexOf(closingTag) + 11;
            if (startIdx > -1 && endIdx > 6) {
                elem.innerHTML = [elem.innerHTML.substring(0, startIdx), elem.innerHTML.slice(endIdx)].join('')
            }
            elem.innerHTML = [elem.innerHTML, openingTag, i18next.t(key, extendDefault(opts, elem.innerHTML), closingTag)].join('');
        } else if( attr === 'useTextContent') {
            const textContentKey = elem.textContent.trim();
            elem.textContent = i18next.t(textContentKey, extendDefault(opts, elem.textContent));
        } else if(attr.indexOf('data-') === 0) {
            let dataAttr = attr.substr('data-'.length);
            let translated = i18next.t(key, extendDefault(opts, elem.getAttribute(dataAttr)));
            // we change into the data cache
            elem.setAttribute(dataAttr, translated);
            // we change into the dom
            elem.setAttribute(attr, translated);
        } else {
            elem.setAttribute(attr, i18next.t(key, extendDefault(opts, elem.getAttribute(attr))));
        }
    };

    function relaxedJsonParse(badJSON) {
      return JSON.parse(badJSON
        .replace(/:\s*"([^"]*)"/g, function (match, p1) {
          return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        .replace(/:\s*'([^']*)'/g, function (match, p1) {
          return ': "' + p1.replace(/:/g, '@colon@') + '"';
        })
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
        .replace(/@colon@/g, ':'));
    }

    function _loc(elem, opts){
        var key = elem.getAttribute(options.selectorAttr);
//        if (!key && typeof key !== 'undefined' && key !== false)
//            key = elem.textContent || elem.innerHTML;
        if(!key) return;

        var target = elem,
            targetSelector = elem.getAttribute(options.targetAttr);

        if(targetSelector != null)
            target = elem.querySelector(targetSelector) || elem;

        if(!opts && options.useOptionsAttr === true){
            const preTranslateObj = relaxedJsonParse(elem.getAttribute(options.preTranslateAttr) ?? "{}");
            const preTranslatedObj =  Object.fromEntries(Object.entries(preTranslateObj).map(([key, value]) => [key, i18next.t(value, {defaultValue: value})]));
        
            opts = relaxedJsonParse(elem.getAttribute(options.optionsAttr) || '{}');
            opts = {...opts, ...preTranslatedObj}
        }

        opts = opts || {};

        if(key.indexOf(';') >= 0) {
            let keys = key.split(';');
            for(let ix=0, l_ix=keys.length; ix < l_ix; ix++){
                if(keys[ix] != '') parse(target, keys[ix], opts);
            }
        } else {
            parse(target, key, opts);
        }

        if(options.useOptionsAttr === true) {
            let clone = {};
            clone = { clone, ...opts };
            delete clone.lng;
            elem.setAttribute(options.optionsAttr, JSON.stringify(clone));
        }
    }

    function handle(targetRoot, opts){
        var elems = [];
        if (targetRoot instanceof HTMLElement) {
            elems = [targetRoot];
        } else{
            const documentScope = opts?.document || options.document;
            elems = documentScope.querySelectorAll(targetRoot);
        }

        for(let i = 0; i < elems.length; i++){
            let elem = elems[i];
            let childs = elem.querySelectorAll('[' + options.selectorAttr + ']');
            for(let j = childs.length - 1; j > -1; j--){
                _loc(childs[j], opts);
            }
            _loc(elem, opts);
        }
    };
    return handle;
}

export default {
    init: init
};
