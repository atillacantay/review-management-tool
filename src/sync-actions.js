import flatten from 'lodash.flatten';
import isEqual from 'lodash.isequal';
import isNil from 'lodash.isnil';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }

  return target;
}

function _typeof(obj) {
  '@babel/helpers - typeof';

  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) ||
    _iterableToArray(arr) ||
    _unsupportedIterableToArray(arr) ||
    _nonIterableSpread()
  );
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (
    (typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) ||
    iter['@@iterator'] != null
  )
    return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i =
    arr == null
      ? null
      : (typeof Symbol !== 'undefined' && arr[Symbol.iterator]) ||
        arr['@@iterator'];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i['return'] != null) _i['return']();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

var _excluded$1 = ['prices'];

function applyOnBeforeDiff(before, now, fn) {
  return fn && typeof fn === 'function' ? fn(before, now) : [before, now];
}

var createPriceComparator = function createPriceComparator(price) {
  return {
    value: {
      currencyCode: price.value.currencyCode,
    },
    channel: price.channel,
    country: price.country,
    customerGroup: price.customerGroup,
    validFrom: price.validFrom,
    validUntil: price.validUntil,
  };
};

function arePricesStructurallyEqual(oldPrice, newPrice) {
  var oldPriceComparison = createPriceComparator(oldPrice);
  var newPriceComparison = createPriceComparator(newPrice);
  return isEqual(newPriceComparison, oldPriceComparison);
}

function extractPriceFromPreviousVariant(newPrice, previousVariant) {
  if (!previousVariant) return null;
  var price = previousVariant.prices.find(function (oldPrice) {
    return arePricesStructurallyEqual(oldPrice, newPrice);
  });
  return price || null;
}

function injectMissingPriceIds(nextVariants, previousVariants) {
  return nextVariants.map(function (newVariant) {
    var prices = newVariant.prices,
      restOfVariant = _objectWithoutProperties(newVariant, _excluded$1);

    if (!prices) return restOfVariant;
    var oldVariant = previousVariants.find(function (previousVariant) {
      return (
        (!isNil(previousVariant.id) && previousVariant.id === newVariant.id) ||
        (!isNil(previousVariant.key) &&
          previousVariant.key === newVariant.key) ||
        (!isNil(previousVariant.sku) && previousVariant.sku === newVariant.sku)
      );
    });
    return _objectSpread2(
      _objectSpread2({}, restOfVariant),
      {},
      {
        prices: prices.map(function (price) {
          var newPrice = _objectSpread2({}, price);

          var oldPrice = extractPriceFromPreviousVariant(price, oldVariant);

          if (oldPrice) {
            // copy ID if not provided
            if (!newPrice.id) newPrice.id = oldPrice.id;
            if (isNil(newPrice.value.type))
              newPrice.value.type = oldPrice.value.type;
            if (isNil(newPrice.value.fractionDigits))
              newPrice.value.fractionDigits = oldPrice.value.fractionDigits;
          }

          return newPrice;
        }),
      }
    );
  });
}

function createBuildActions(differ, doMapActions, onBeforeDiff) {
  var buildActionsConfig =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function buildActions(now, before) {
    var options =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!now || !before)
      throw new Error(
        'Missing either `newObj` or `oldObj` ' +
          'in order to build update actions'
      );

    var _applyOnBeforeDiff = applyOnBeforeDiff(before, now, onBeforeDiff),
      _applyOnBeforeDiff2 = _slicedToArray(_applyOnBeforeDiff, 2),
      processedBefore = _applyOnBeforeDiff2[0],
      processedNow = _applyOnBeforeDiff2[1];

    if (processedNow.variants && processedBefore.variants)
      processedNow.variants = injectMissingPriceIds(
        processedNow.variants,
        processedBefore.variants
      );
    var diffed = differ(processedBefore, processedNow);
    if (!buildActionsConfig.withHints && !diffed) return [];
    return doMapActions(diffed, processedNow, processedBefore, options);
  };
}

// Array of action groups which need to be allowed or ignored.
// Example:
// [
//   { type: 'base', group: 'ignore' },
//   { type: 'prices', group: 'allow' },
//   { type: 'variants', group: 'ignore' },
// ]
function createMapActionGroup() {
  var actionGroups =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function mapActionGroup(type, fn) {
    if (!Object.keys(actionGroups).length) return fn();
    var found = actionGroups.find(function (c) {
      return c.type === type;
    });
    if (!found) return []; // Keep `black` for backwards compatibility.

    if (found.group === 'ignore' || found.group === 'black') return []; // Keep `white` for backwards compatibility.

    if (found.group === 'allow' || found.group === 'white') return fn();
    throw new Error(
      "Action group '".concat(
        found.group,
        '\' not supported. Use either "allow" or "ignore".'
      )
    );
  };
}

// jsondiffpatch does not yet handle minified UMD builds
// with es6 modules so we use require instead below
// TODO create an issue here https://github.com/benjamine/jsondiffpatch/issues/new
var DiffPatcher = require('jsondiffpatch').DiffPatcher;

function objectHash(obj, index) {
  var objIndex = '$$index:'.concat(index);
  return _typeof(obj) === 'object' && obj !== null
    ? obj.id || obj.name || obj.url || objIndex
    : objIndex;
}
var diffpatcher = new DiffPatcher({
  objectHash: objectHash,
  arrays: {
    // detect items moved inside the array
    detectMove: true,
    // value of items moved is not included in deltas
    includeValueOnMove: false,
  },
  textDiff: {
    // If the value to diff has a bigger length,
    // a text diffing algorithm is used
    // See https://github.com/benjamine/jsondiffpatch/
    // blob/master/docs/deltas.md#text-diffs
    minLength: 300,
  },
});
function diff(oldObj, newObj) {
  return diffpatcher.diff(oldObj, newObj);
}
function patch(obj, delta) {
  return diffpatcher.patch(obj, delta);
}
function getDeltaValue(arr, originalObject) {
  if (!Array.isArray(arr))
    throw new Error('Expected array to extract delta value');
  if (arr.length === 1) return arr[0]; // new

  if (arr.length === 2) return arr[1]; // update

  if (arr.length === 3 && arr[2] === 0) return undefined; // delete

  if (arr.length === 3 && arr[2] === 2) {
    // text diff
    if (!originalObject)
      throw new Error(
        'Cannot apply patch to long text diff. Missing original object.'
      ); // try to apply patch to given object based on delta value

    return patch(originalObject, arr);
  }

  if (arr.length === 3 && arr[2] === 3)
    // array move
    throw new Error(
      'Detected an array move, it should not happen as ' +
        '`includeValueOnMove` should be set to false'
    );
  throw new Error('Got unsupported number '.concat(arr[2], ' in delta value'));
}

var _excluded = ['actions'];
var Actions = {
  setCustomType: 'setCustomType',
  setCustomField: 'setCustomField',
};

var hasSingleCustomFieldChanged = function hasSingleCustomFieldChanged(diff) {
  return Array.isArray(diff.custom);
};

var haveMultipleCustomFieldsChanged = function haveMultipleCustomFieldsChanged(
  diff
) {
  return Boolean(diff.custom.fields);
};

var hasCustomTypeChanged = function hasCustomTypeChanged(diff) {
  return Boolean(diff.custom.type);
};

var extractCustomType = function extractCustomType(diff, previousObject) {
  return Array.isArray(diff.custom.type)
    ? getDeltaValue(diff.custom.type, previousObject)
    : diff.custom.type;
};

var extractTypeId = function extractTypeId(type, nextObject) {
  return Array.isArray(type.id)
    ? getDeltaValue(type.id)
    : nextObject.custom.type.id;
};

var extractTypeKey = function extractTypeKey(type, nextObject) {
  return Array.isArray(type.key)
    ? getDeltaValue(type.key)
    : nextObject.custom.type.key;
};

var extractTypeFields = function extractTypeFields(diffedFields, nextFields) {
  return Array.isArray(diffedFields) ? getDeltaValue(diffedFields) : nextFields;
};

var extractFieldValue = function extractFieldValue(newFields, fieldName) {
  return newFields[fieldName];
};

function actionsMapCustom(diff, newObj, oldObj) {
  var customProps =
    arguments.length > 3 && arguments[3] !== undefined
      ? arguments[3]
      : {
          actions: {},
        };
  var actions = [];

  var customPropsActions = customProps.actions,
    options = _objectWithoutProperties(customProps, _excluded);

  var actionGroup = _objectSpread2(
    _objectSpread2({}, Actions),
    customPropsActions
  );

  if (!diff.custom) return actions;

  if (hasSingleCustomFieldChanged(diff)) {
    // If custom is not defined on the new or old category
    var custom = getDeltaValue(diff.custom, oldObj);
    actions.push(
      _objectSpread2(
        _objectSpread2(
          {
            action: actionGroup.setCustomType,
          },
          options
        ),
        custom
      )
    );
  } else if (hasCustomTypeChanged(diff)) {
    // If custom is set to an empty object on the new or old category
    var type = extractCustomType(diff, oldObj);
    if (!type)
      actions.push(
        _objectSpread2(
          {
            action: actionGroup.setCustomType,
          },
          options
        )
      );
    else if (type.id)
      actions.push(
        _objectSpread2(
          _objectSpread2(
            {
              action: actionGroup.setCustomType,
            },
            options
          ),
          {},
          {
            type: {
              typeId: 'type',
              id: extractTypeId(type, newObj),
            },
            fields: extractTypeFields(diff.custom.fields, newObj.custom.fields),
          }
        )
      );
    else if (type.key)
      actions.push(
        _objectSpread2(
          _objectSpread2(
            {
              action: actionGroup.setCustomType,
            },
            options
          ),
          {},
          {
            type: {
              typeId: 'type',
              key: extractTypeKey(type, newObj),
            },
            fields: extractTypeFields(diff.custom.fields, newObj.custom.fields),
          }
        )
      );
  } else if (haveMultipleCustomFieldsChanged(diff)) {
    var customFieldsActions = Object.keys(diff.custom.fields).map(function (
      name
    ) {
      return _objectSpread2(
        _objectSpread2(
          {
            action: actionGroup.setCustomField,
          },
          options
        ),
        {},
        {
          name: name,
          value: extractFieldValue(newObj.custom.fields, name),
        }
      );
    });
    actions.push.apply(actions, _toConsumableArray(customFieldsActions));
  }

  return actions;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

var normalizeValue = function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : value;
};

var createIsEmptyValue = function createIsEmptyValue(emptyValues) {
  return function (value) {
    return emptyValues.some(function (emptyValue) {
      return emptyValue === normalizeValue(value);
    });
  };
};
/**
 * Builds actions for simple object properties, given a list of actions
 * E.g. [{ action: `changeName`, key: 'name' }]
 *
 * @param  {Array} options.actions - a list of actions to be built
 * based on the given property
 * @param  {Object} options.diff - the diff object
 * @param  {Object} options.oldObj - the object that needs to be updated
 * @param  {Object} options.newObj - the new representation of the object
 * @param {Boolean} options.shouldOmitEmptyString - a flag to determine if we should treat an empty string a NON-value
 */

function buildBaseAttributesActions(_ref) {
  var actions = _ref.actions,
    diff = _ref.diff,
    oldObj = _ref.oldObj,
    newObj = _ref.newObj,
    shouldOmitEmptyString = _ref.shouldOmitEmptyString;
  var isEmptyValue = createIsEmptyValue(
    shouldOmitEmptyString ? [undefined, null, ''] : [undefined, null]
  );
  return actions
    .map(function (item) {
      var key = item.key; // e.g.: name, description, ...

      var actionKey = item.actionKey || item.key;
      var delta = diff[key];
      var before = oldObj[key];
      var now = newObj[key];
      var isNotDefinedBefore = isEmptyValue(oldObj[key]);
      var isNotDefinedNow = isEmptyValue(newObj[key]);
      if (!delta) return undefined;
      if (isNotDefinedNow && isNotDefinedBefore) return undefined;
      if (!isNotDefinedNow && isNotDefinedBefore)
        // no value previously set
        return _defineProperty(
          {
            action: item.action,
          },
          actionKey,
          now
        );
      /* no new value */

      if (isNotDefinedNow && !{}.hasOwnProperty.call(newObj, key))
        return undefined;
      if (isNotDefinedNow && {}.hasOwnProperty.call(newObj, key))
        // value unset
        return {
          action: item.action,
        }; // We need to clone `before` as `patch` will mutate it

      var patched = patch(clone(before), delta);
      return _defineProperty(
        {
          action: item.action,
        },
        actionKey,
        patched
      );
    })
    .filter(function (action) {
      return !isNil(action);
    });
}

var HAS_WEAKSET_SUPPORT = typeof WeakSet === 'function';
var keys = Object.keys;
/**
 * @function addToCache
 *
 * add object to cache if an object
 *
 * @param value the value to potentially add to cache
 * @param cache the cache to add to
 */

function addToCache(value, cache) {
  if (value && _typeof(value) === 'object') {
    cache.add(value);
  }
}
/**
 * @function hasPair
 *
 * @description
 * does the `pairToMatch` exist in the list of `pairs` provided based on the
 * `isEqual` check
 *
 * @param pairs the pairs to compare against
 * @param pairToMatch the pair to match
 * @param isEqual the equality comparator used
 * @param meta the meta provided
 * @returns does the pair exist in the pairs provided
 */

function hasPair(pairs, pairToMatch, isEqual, meta) {
  var length = pairs.length;
  var pair;

  for (var index = 0; index < length; index++) {
    pair = pairs[index];

    if (
      isEqual(pair[0], pairToMatch[0], meta) &&
      isEqual(pair[1], pairToMatch[1], meta)
    ) {
      return true;
    }
  }

  return false;
}
/**
 * @function hasValue
 *
 * @description
 * does the `valueToMatch` exist in the list of `values` provided based on the
 * `isEqual` check
 *
 * @param values the values to compare against
 * @param valueToMatch the value to match
 * @param isEqual the equality comparator used
 * @param meta the meta provided
 * @returns does the value exist in the values provided
 */

function hasValue(values, valueToMatch, isEqual, meta) {
  var length = values.length;

  for (var index = 0; index < length; index++) {
    if (isEqual(values[index], valueToMatch, meta)) {
      return true;
    }
  }

  return false;
}
/**
 * @function sameValueZeroEqual
 *
 * @description
 * are the values passed strictly equal or both NaN
 *
 * @param a the value to compare against
 * @param b the value to test
 * @returns are the values equal by the SameValueZero principle
 */

function sameValueZeroEqual(a, b) {
  return a === b || (a !== a && b !== b);
}
/**
 * @function isPlainObject
 *
 * @description
 * is the value a plain object
 *
 * @param value the value to test
 * @returns is the value a plain object
 */

function isPlainObject(value) {
  return value.constructor === Object || value.constructor == null;
}
/**
 * @function isPromiseLike
 *
 * @description
 * is the value promise-like (meaning it is thenable)
 *
 * @param value the value to test
 * @returns is the value promise-like
 */

function isPromiseLike(value) {
  return !!value && typeof value.then === 'function';
}
/**
 * @function isReactElement
 *
 * @description
 * is the value passed a react element
 *
 * @param value the value to test
 * @returns is the value a react element
 */

function isReactElement(value) {
  return !!(value && value.$$typeof);
}
/**
 * @function getNewCacheFallback
 *
 * @description
 * in cases where WeakSet is not supported, creates a new custom
 * object that mimics the necessary API aspects for cache purposes
 *
 * @returns the new cache object
 */

function getNewCacheFallback() {
  return Object.create({
    _values: [],
    add: function add(value) {
      this._values.push(value);
    },
    has: function has(value) {
      return this._values.indexOf(value) !== -1;
    },
  });
}
/**
 * @function getNewCache
 *
 * @description
 * get a new cache object to prevent circular references
 *
 * @returns the new cache object
 */

var getNewCache = (function (canUseWeakMap) {
  if (canUseWeakMap) {
    return function _getNewCache() {
      return new WeakSet();
    };
  }

  return getNewCacheFallback;
})(HAS_WEAKSET_SUPPORT);
/**
 * @function createCircularEqualCreator
 *
 * @description
 * create a custom isEqual handler specific to circular objects
 *
 * @param [isEqual] the isEqual comparator to use instead of isDeepEqual
 * @returns the method to create the `isEqual` function
 */

function createCircularEqualCreator(isEqual) {
  return function createCircularEqual(comparator) {
    var _comparator = isEqual || comparator;

    return function circularEqual(a, b, cache) {
      if (cache === void 0) {
        cache = getNewCache();
      }

      var hasA = cache.has(a);
      var hasB = cache.has(b);

      if (hasA || hasB) {
        return hasA && hasB;
      }

      addToCache(a, cache);
      addToCache(b, cache);
      return _comparator(a, b, cache);
    };
  };
}
/**
 * @function toPairs
 *
 * @description
 * convert the map passed into pairs (meaning an array of [key, value] tuples)
 *
 * @param map the map to convert to [key, value] pairs (entries)
 * @returns the [key, value] pairs
 */

function toPairs(map) {
  var pairs = new Array(map.size);
  var index = 0;
  map.forEach(function (value, key) {
    pairs[index++] = [key, value];
  });
  return pairs;
}
/**
 * @function toValues
 *
 * @description
 * convert the set passed into values
 *
 * @param set the set to convert to values
 * @returns the values
 */

function toValues(set) {
  var values = new Array(set.size);
  var index = 0;
  set.forEach(function (value) {
    values[index++] = value;
  });
  return values;
}
/**
 * @function areArraysEqual
 *
 * @description
 * are the arrays equal in value
 *
 * @param a the array to test
 * @param b the array to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the arrays equal
 */

function areArraysEqual(a, b, isEqual, meta) {
  var length = a.length;

  if (b.length !== length) {
    return false;
  }

  for (var index = 0; index < length; index++) {
    if (!isEqual(a[index], b[index], meta)) {
      return false;
    }
  }

  return true;
}
/**
 * @function areMapsEqual
 *
 * @description
 * are the maps equal in value
 *
 * @param a the map to test
 * @param b the map to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta map to pass through
 * @returns are the maps equal
 */

function areMapsEqual(a, b, isEqual, meta) {
  if (a.size !== b.size) {
    return false;
  }

  var pairsA = toPairs(a);
  var pairsB = toPairs(b);
  var length = pairsA.length;

  for (var index = 0; index < length; index++) {
    if (
      !hasPair(pairsB, pairsA[index], isEqual, meta) ||
      !hasPair(pairsA, pairsB[index], isEqual, meta)
    ) {
      return false;
    }
  }

  return true;
}

var OWNER = '_owner';
var hasOwnProperty = Function.prototype.bind.call(
  Function.prototype.call,
  Object.prototype.hasOwnProperty
);
/**
 * @function areObjectsEqual
 *
 * @description
 * are the objects equal in value
 *
 * @param a the object to test
 * @param b the object to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the objects equal
 */

function areObjectsEqual(a, b, isEqual, meta) {
  var keysA = keys(a);
  var length = keysA.length;

  if (keys(b).length !== length) {
    return false;
  }

  var key;

  for (var index = 0; index < length; index++) {
    key = keysA[index];

    if (!hasOwnProperty(b, key)) {
      return false;
    }

    if (key === OWNER && isReactElement(a)) {
      if (!isReactElement(b)) {
        return false;
      }
    } else if (!isEqual(a[key], b[key], meta)) {
      return false;
    }
  }

  return true;
}
/**
 * @function areRegExpsEqual
 *
 * @description
 * are the regExps equal in value
 *
 * @param a the regExp to test
 * @param b the regExp to test agains
 * @returns are the regExps equal
 */

function areRegExpsEqual(a, b) {
  return (
    a.source === b.source &&
    a.global === b.global &&
    a.ignoreCase === b.ignoreCase &&
    a.multiline === b.multiline &&
    a.unicode === b.unicode &&
    a.sticky === b.sticky &&
    a.lastIndex === b.lastIndex
  );
}
/**
 * @function areSetsEqual
 *
 * @description
 * are the sets equal in value
 *
 * @param a the set to test
 * @param b the set to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta set to pass through
 * @returns are the sets equal
 */

function areSetsEqual(a, b, isEqual, meta) {
  if (a.size !== b.size) {
    return false;
  }

  var valuesA = toValues(a);
  var valuesB = toValues(b);
  var length = valuesA.length;

  for (var index = 0; index < length; index++) {
    if (
      !hasValue(valuesB, valuesA[index], isEqual, meta) ||
      !hasValue(valuesA, valuesB[index], isEqual, meta)
    ) {
      return false;
    }
  }

  return true;
}

var isArray = Array.isArray;
var HAS_MAP_SUPPORT = typeof Map === 'function';
var HAS_SET_SUPPORT = typeof Set === 'function';
var OBJECT_TYPEOF = 'object';

function createComparator(createIsEqual) {
  var isEqual =
    /* eslint-disable no-use-before-define */
    typeof createIsEqual === 'function'
      ? createIsEqual(comparator)
      : comparator;
  /* eslint-enable */

  /**
   * @function comparator
   *
   * @description
   * compare the value of the two objects and return true if they are equivalent in values
   *
   * @param a the value to test against
   * @param b the value to test
   * @param [meta] an optional meta object that is passed through to all equality test calls
   * @returns are a and b equivalent in value
   */

  function comparator(a, b, meta) {
    if (sameValueZeroEqual(a, b)) {
      return true;
    }

    if (
      a &&
      b &&
      _typeof(a) === OBJECT_TYPEOF &&
      _typeof(b) === OBJECT_TYPEOF
    ) {
      if (isPlainObject(a) && isPlainObject(b)) {
        return areObjectsEqual(a, b, isEqual, meta);
      }

      var arrayA = isArray(a);
      var arrayB = isArray(b);

      if (arrayA || arrayB) {
        return arrayA === arrayB && areArraysEqual(a, b, isEqual, meta);
      }

      var aDate = a instanceof Date;
      var bDate = b instanceof Date;

      if (aDate || bDate) {
        return aDate === bDate && sameValueZeroEqual(a.getTime(), b.getTime());
      }

      var aRegExp = a instanceof RegExp;
      var bRegExp = b instanceof RegExp;

      if (aRegExp || bRegExp) {
        return aRegExp === bRegExp && areRegExpsEqual(a, b);
      }

      if (isPromiseLike(a) || isPromiseLike(b)) {
        return a === b;
      }

      if (HAS_MAP_SUPPORT) {
        var aMap = a instanceof Map;
        var bMap = b instanceof Map;

        if (aMap || bMap) {
          return aMap === bMap && areMapsEqual(a, b, isEqual, meta);
        }
      }

      if (HAS_SET_SUPPORT) {
        var aSet = a instanceof Set;
        var bSet = b instanceof Set;

        if (aSet || bSet) {
          return aSet === bSet && areSetsEqual(a, b, isEqual, meta);
        }
      }

      return areObjectsEqual(a, b, isEqual, meta);
    }

    return false;
  }

  return comparator;
} // comparator

createComparator(function () {
  return sameValueZeroEqual;
});
createComparator(createCircularEqualCreator());
createComparator(createCircularEqualCreator(sameValueZeroEqual));

// `buildBasAttributesActions` generates update-actions with help of `diff`,
// which is an object consisting of flags which indicates different operations.
// `generateBaseFieldsUpdateActions` only generate based on `previous` and `next`.

/**
 * Builds actions for simple reference objects, given a list of actions
 * E.g. [{ action: `setTaxCategory`, key: 'taxCategory' }]
 *
 * @param  {Array} options.actions - a list of actions to be built
 * based on the given property
 * @param  {Object} options.diff - the diff object
 * @param  {Object} options.oldObj - the object that needs to be updated
 * @param  {Object} options.newObj - the new representation of the object
 */

function buildReferenceActions(_ref4) {
  var actions = _ref4.actions,
    diff = _ref4.diff,
    newObj = _ref4.newObj;
  return actions
    .map(function (item) {
      var action = item.action;
      var key = item.key;

      if (
        diff[key] && // The `key` value was added or removed
        (Array.isArray(diff[key]) || // The `key` value id changed
          diff[key].id)
      ) {
        var newValue = Array.isArray(diff[key])
          ? getDeltaValue(diff[key])
          : newObj[key];
        if (!newValue)
          return {
            action: action,
          }; // When the `id` of the object is undefined

        if (!newValue.id) {
          return _defineProperty(
            {
              action: action,
            },
            key,
            {
              typeId: newValue.typeId,
              key: newValue.key,
            }
          );
        }

        return _defineProperty(
          {
            action: action,
          },
          key,
          {
            typeId: newValue.typeId,
            id: newValue.id,
          }
        );
      }

      return undefined;
    })
    .filter(function (action) {
      return action;
    });
}

const baseActionsList$4 = [
  {
    action: 'setKey',
    key: 'key',
  },
  {
    action: 'setAuthorName',
    key: 'authorName',
  },
  {
    action: 'setCustomer',
    key: 'customer',
  },
  {
    action: 'setRating',
    key: 'rating',
  },
  {
    action: 'setTarget',
    key: 'target',
  },
  {
    action: 'setText',
    key: 'text',
  },
  {
    action: 'setTitle',
    key: 'title',
  },
  {
    action: 'setLocale',
    key: 'locale',
  },
  {
    action: 'transitionState',
    key: 'state',
  },
];

var referenceActionsList$1 = [];

function actionsMapBase$4(diff, oldObj, newObj) {
  var config =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return buildBaseAttributesActions({
    actions: baseActionsList$4,
    diff: diff,
    oldObj: oldObj,
    newObj: newObj,
    shouldOmitEmptyString: config.shouldOmitEmptyString,
  });
}

function actionsMapReferences$1(diff, oldObj, newObj) {
  return buildReferenceActions({
    actions: referenceActionsList$1,
    diff: diff,
    oldObj: oldObj,
    newObj: newObj,
  });
}

function createReviewsMapActions$1(mapActionGroup, syncActionConfig) {
  return function doMapActions(diff, newObj, oldObj) {
    var allActions = [];
    allActions.push(
      mapActionGroup('base', function () {
        return actionsMapBase$4(diff, oldObj, newObj, syncActionConfig);
      })
    );
    allActions.push(
      mapActionGroup('references', function () {
        return actionsMapReferences$1(diff, oldObj, newObj);
      })
    );
    allActions.push(
      mapActionGroup('custom', function () {
        return actionsMapCustom(diff, newObj, oldObj);
      })
    );
    return flatten(allActions);
  };
}

var reviews = function (actionGroupList) {
  var syncActionConfig =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mapActionGroup = createMapActionGroup(actionGroupList);
  var doMapActions = createReviewsMapActions$1(
    mapActionGroup,
    syncActionConfig
  );
  var buildActions = createBuildActions(diff, doMapActions);
  return {
    buildActions: buildActions,
  };
};

export { reviews as createSyncReviews };
