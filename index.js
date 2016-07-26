/**
 * Created by allen on 2016/7/25 0025.
 */
"use strict";
var extend = require('extend');
var SCHEMA_DRAFT_V4 = "http://json-schema.org/draft-04/schema#";
var protoObj2String = function (val) { return Object.prototype.toString.call(val); };
var Schema = (function () {
    function Schema($schema, title, type, properties, items, required) {
        this.$schema = $schema;
        this.title = title;
        this.type = type;
        if (properties) {
            this.properties = properties;
        }
        if (items) {
            this.items = items;
        }
        if (required) {
            this.required = required;
        }
    }
    Schema.prototype.generate = function () {
        return JSON.stringify(this);
    };
    return Schema;
}());
var UniqueStringArray = (function () {
    function UniqueStringArray() {
        this.container = {};
        this.hasChanged = true;
        this.cacheArray = [];
    }
    UniqueStringArray.prototype.push = function (val) {
        this.container[val] = true;
        this.hasChanged = true;
    };
    UniqueStringArray.prototype.pushArr = function (vals) {
        var _this = this;
        vals && vals.forEach(function (val) { return _this.push(val); });
    };
    UniqueStringArray.prototype.toArray = function () {
        if (!this.hasChanged) {
            return this.cacheArray;
        }
        this.hasChanged = false;
        this.cacheArray.length = 0;
        for (var key in this.container) {
            this.cacheArray.push(key);
        }
        return this.cacheArray;
    };
    return UniqueStringArray;
}());
function getType(val) {
    return protoObj2String(val).replace(/^\[object (\w+)\]$/ig, '$1').toLowerCase();
}
function isTargetType(val, target) {
    return protoObj2String(val) === "[object " + target + "]";
}
function getJson(input) {
    return isTargetType(input, "String") ? JSON.parse(input) : input;
}
function isObjectEmpty(val) {
    return !val || Object.keys(val).length === 0;
}
function isArrayEmpty(arr) {
    return !arr || arr.length === 0;
}
function processObject(json, output, nested) {
    if (nested && output) {
        output = {
            properties: output
        };
    }
    else {
        output = output || {};
        output.type = getType(json);
        output.properties = output.properties || {};
    }
    var uniqueStringArray = new UniqueStringArray();
    for (var key in json) {
        var type = void 0;
        var value = json[key];
        if (isTargetType(value, "Undefined")) {
            type = 'null';
        }
        output.properties[key] = generateSchema(value);
        uniqueStringArray.push(key);
    }
    output.required = uniqueStringArray.toArray();
    return nested ? output.properties : output;
}
function processArray(array, output, isNested) {
    output = output || {};
    output.type = getType(array);
    output.items = output.items || new Schema();
    for (var index = 0, length = array.length; index < length; index++) {
        var value = array[index];
        var itemType = getType(value);
        var required = [];
        if (isTargetType(value, 'Object') && output.items.properties) {
            var uniqueStringArray = new UniqueStringArray();
            uniqueStringArray.pushArr(Object.keys(output.items.properties));
            uniqueStringArray.pushArr(output.items.required);
            output.items.required = uniqueStringArray.toArray();
        }
        output.items.properties = generateSchema(value, output.items.properties, true);
    }
    return isNested ? output.items : output;
}
function generateSchema(json, output, isNested) {
    if (isTargetType(json, "Object")) {
        return processObject(json, output, isNested);
    }
    else if (isTargetType(json, "Array")) {
        return processArray(json, output, isNested);
    }
    else {
        return { type: getType(json) };
    }
}
exports.generateSchema = generateSchema;
function json2schema(schemaTitle, input) {
    if (isObjectEmpty(input)) {
        throw new Error('index.ts: input object has no property');
    }
    if (isArrayEmpty(input)) {
        throw new Error('index.ts: input array is empty');
    }
    var json = getJson(input);
    return extend(new Schema(SCHEMA_DRAFT_V4, schemaTitle, getType(json)), generateSchema(json));
}
exports.json2schema = json2schema;
//# sourceMappingURL=index.js.map