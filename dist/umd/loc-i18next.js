(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.locI18next = factory());
}(this, (function () { 'use strict';

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

var defaults = {
  selectorAttr: 'data-i18n',
  targetAttr: 'i18n-target',
  optionsAttr: 'i18n-options',
  insertTagName: 'loc-i18n',
  useOptionsAttr: false,
  parseDefaultValueFromContent: true,
  // `document` if running inside a browser, but otherwise undefined (prevents reference error when ran outside browser)
  document: typeof window !== 'undefined' ? document : undefined
};
function init(i18next) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = _objectSpread2(_objectSpread2({}, defaults), options);
  var extendDefault = function extendDefault(o, interpolationObj, val) {
    return options.parseDefaultValueFromContent ? _objectSpread2(_objectSpread2(_objectSpread2({}, o), interpolationObj), {}, {
      defaultValue: val
    }) : _objectSpread2(_objectSpread2({}, o), interpolationObj);
  };
  function getInterpolationObj(elem) {
    var _elem$getAttribute;
    var interpolationAttr = (_elem$getAttribute = elem.getAttribute(options.selectorAttr + "-interpolation")) !== null && _elem$getAttribute !== void 0 ? _elem$getAttribute : "{}";
    try {
      return relaxedJsonParse(interpolationAttr);
    } catch (e) {
      console.error(e);
      return {};
    }
  }
  function parse(elem, key, opts) {
    var attr = 'text';
    if (key.indexOf('[') == 0) {
      var parts = key.split(']');
      key = parts[1];
      attr = parts[0].substr(1, parts[0].length - 1);
    }
    key = key.indexOf(';') == key.length - 1 ? key.substr(0, key.length - 2) : key;
    var openingTag = "<".concat(options.insertTagName, ">");
    var closingTag = "</".concat(options.insertTagName, ">");
    var interpolationObj = getInterpolationObj(elem);
    if (attr === 'html') {
      elem.innerHTML = i18next.t(key, extendDefault(opts, interpolationObj, elem.innerHTML));
    } else if (attr === 'text') {
      elem.textContent = i18next.t(key, extendDefault(opts, interpolationObj, elem.textContent));
    } else if (attr === 'prepend') {
      var startIdx = elem.innerHTML.indexOf(openingTag);
      var endIdx = elem.innerHTML.indexOf(closingTag) + 11;
      if (startIdx > -1 && endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, startIdx), elem.innerHTML.slice(endIdx)].join('');
      }
      elem.innerHTML = [openingTag, i18next.t(key, extendDefault(opts, interpolationObj, elem.innerHTML)), closingTag, elem.innerHTML].join('');
    } else if (attr === 'append') {
      var _startIdx = elem.innerHTML.indexOf(openingTag);
      var _endIdx = elem.innerHTML.indexOf(closingTag) + 11;
      if (_startIdx > -1 && _endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, _startIdx), elem.innerHTML.slice(_endIdx)].join('');
      }
      elem.innerHTML = [elem.innerHTML, openingTag, i18next.t(key, extendDefault(opts, interpolationObj, elem.innerHTML), closingTag)].join('');
    } else if (attr === 'useTextContent') {
      var textContentKey = elem.textContent;
      elem.textContent = i18next.t(textContentKey, extendDefault(opts, interpolationObj, elem.textContent));
    } else if (attr.indexOf('data-') === 0) {
      var dataAttr = attr.substr('data-'.length);
      var translated = i18next.t(key, extendDefault(opts, interpolationObj, elem.getAttribute(dataAttr)));
      // we change into the data cache
      elem.setAttribute(dataAttr, translated);
      // we change into the dom
      elem.setAttribute(attr, translated);
    } else {
      elem.setAttribute(attr, i18next.t(key, extendDefault(opts, interpolationObj, elem.getAttribute(attr))));
    }
  }
  ;
  function relaxedJsonParse(badJSON) {
    return JSON.parse(badJSON.replace(/:\s*"([^"]*)"/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, '@colon@') + '"';
    }).replace(/:\s*'([^']*)'/g, function (match, p1) {
      return ': "' + p1.replace(/:/g, '@colon@') + '"';
    }).replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ').replace(/@colon@/g, ':'));
  }
  function _loc(elem, opts) {
    var key = elem.getAttribute(options.selectorAttr);
    //        if (!key && typeof key !== 'undefined' && key !== false)
    //            key = elem.textContent || elem.innerHTML;
    if (!key) return;
    var target = elem,
      targetSelector = elem.getAttribute(options.targetAttr);
    if (targetSelector != null) target = elem.querySelector(targetSelector) || elem;
    if (!opts && options.useOptionsAttr === true) opts = relaxedJsonParse(elem.getAttribute(options.optionsAttr) || '{}');
    opts = opts || {};
    if (key.indexOf(';') >= 0) {
      var keys = key.split(';');
      for (var ix = 0, l_ix = keys.length; ix < l_ix; ix++) {
        if (keys[ix] != '') parse(target, keys[ix], opts);
      }
    } else {
      parse(target, key, opts);
    }
    if (options.useOptionsAttr === true) {
      var clone = {};
      clone = _objectSpread2({
        clone: clone
      }, opts);
      delete clone.lng;
      elem.setAttribute(options.optionsAttr, JSON.stringify(clone));
    }
  }
  function handle(selector, opts) {
    var document = (opts === null || opts === void 0 ? void 0 : opts.document) || options.document;
    var elems = document.querySelectorAll(selector);
    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      var childs = elem.querySelectorAll('[' + options.selectorAttr + ']');
      for (var j = childs.length - 1; j > -1; j--) {
        _loc(childs[j], opts);
      }
      _loc(elem, opts);
    }
  }
  ;
  return handle;
}
var main = {
  init: init
};

return main;

})));