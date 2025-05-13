function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaults = {
  selectorAttr: 'data-i18n',
  targetAttr: 'i18n-target',
  optionsAttr: 'i18n-options',
  preTranslateAttr: 'data-i18n-pre',
  insertTagName: 'loc-i18n',
  useOptionsAttr: false,
  parseDefaultValueFromContent: true,
  // `document` if running inside a browser, but otherwise undefined (prevents reference error when ran outside browser)
  document: typeof window !== 'undefined' ? document : undefined
};
function init(i18next) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  options = _objectSpread(_objectSpread({}, defaults), options);
  var extendDefault = function extendDefault(o, val) {
    return options.parseDefaultValueFromContent ? _objectSpread(_objectSpread({}, o), {
      defaultValue: val
    }) : o;
  };
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
    if (attr === 'html') {
      elem.innerHTML = i18next.t(key, extendDefault(opts, elem.innerHTML));
    } else if (attr === 'text') {
      elem.textContent = i18next.t(key, extendDefault(opts, elem.textContent));
    } else if (attr === 'prepend') {
      var startIdx = elem.innerHTML.indexOf(openingTag);
      var endIdx = elem.innerHTML.indexOf(closingTag) + 11;
      if (startIdx > -1 && endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, startIdx), elem.innerHTML.slice(endIdx)].join('');
      }
      elem.innerHTML = [openingTag, i18next.t(key, extendDefault(opts, elem.innerHTML)), closingTag, elem.innerHTML].join('');
    } else if (attr === 'append') {
      var _startIdx = elem.innerHTML.indexOf(openingTag);
      var _endIdx = elem.innerHTML.indexOf(closingTag) + 11;
      if (_startIdx > -1 && _endIdx > 6) {
        elem.innerHTML = [elem.innerHTML.substring(0, _startIdx), elem.innerHTML.slice(_endIdx)].join('');
      }
      elem.innerHTML = [elem.innerHTML, openingTag, i18next.t(key, extendDefault(opts, elem.innerHTML), closingTag)].join('');
    } else if (attr === 'useTextContent') {
      var textContentKey = elem.textContent;
      elem.textContent = i18next.t(textContentKey, extendDefault(opts, elem.textContent));
    } else if (attr.indexOf('data-') === 0) {
      var dataAttr = attr.substr('data-'.length);
      var translated = i18next.t(key, extendDefault(opts, elem.getAttribute(dataAttr)));
      // we change into the data cache
      elem.setAttribute(dataAttr, translated);
      // we change into the dom
      elem.setAttribute(attr, translated);
    } else {
      elem.setAttribute(attr, i18next.t(key, extendDefault(opts, elem.getAttribute(attr))));
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
    if (!opts && options.useOptionsAttr === true) {
      var _elem$getAttribute;
      var preTranslateObj = relaxedJsonParse((_elem$getAttribute = elem.getAttribute(options.preTranslateAttr)) !== null && _elem$getAttribute !== void 0 ? _elem$getAttribute : "{}");
      var preTranslatedObj = Object.fromEntries(Object.entries(preTranslateObj).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        return [key, i18next.t(value, {
          defaultValue: value
        })];
      }));
      opts = relaxedJsonParse(elem.getAttribute(options.optionsAttr) || '{}');
      opts = _objectSpread(_objectSpread({}, opts), preTranslatedObj);
    }
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
      clone = _objectSpread({
        clone: clone
      }, opts);
      delete clone.lng;
      elem.setAttribute(options.optionsAttr, JSON.stringify(clone));
    }
  }
  function handle(targetRoot, opts) {
    var elems = [];
    if (targetRoot instanceof HTMLElement) {
      elems = [targetRoot];
    } else {
      var documentScope = (opts === null || opts === void 0 ? void 0 : opts.document) || options.document;
      elems = documentScope.querySelectorAll(targetRoot);
    }
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
export default {
  init: init
};