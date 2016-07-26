/**
 * Created by allen on 2016/7/25 0025.
 */

import * as extend from 'extend';


const SCHEMA_DRAFT_V4 = "http://json-schema.org/draft-04/schema#";
const protoObj2String:Function = (val:any)=> Object.prototype.toString.call(val);

class Schema {
    $schema:string;
    title:string;
    type:string;
    properties:Object;
    items:Schema;
    required:Array<any>;

    constructor($schema?:string, title?:string, type?:string, properties?:Object, items?:Schema, required?:Array<any>) {
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

    private generate():string {
        return JSON.stringify(this);
    }
}


class UniqueStringArray {
    private container:Object;
    private hasChanged:boolean;
    private cacheArray:string[];

    constructor() {
        this.container = {};
        this.hasChanged = true;
        this.cacheArray = [];
    }

    push(val:string) {
        this.container[val] = true;
        this.hasChanged = true;
    }

    pushArr(vals:Array<string>) {
        vals && vals.forEach((val)=>this.push(val));
    }

    toArray() {
        if (!this.hasChanged) {
            return this.cacheArray;
        }
        this.hasChanged = false;
        this.cacheArray.length = 0;
        for (let key in this.container) {
            this.cacheArray.push(key);
        }
        return this.cacheArray;
    }
}


function getType(val):string {
    return protoObj2String(val).replace(/^\[object (\w+)\]$/ig, '$1').toLowerCase();
}


function isTargetType(val:any, target:"Object"|"Number"|"Null"|"String"|"Boolean"|"Undefined"|"Array") {
    return protoObj2String(val) === `[object ${target}]`;
}

function getJson(input:Object|string):Object {
    return isTargetType(input, "String") ? JSON.parse(input as string) : input;
}

function isObjectEmpty(val:Object) {
    return !val || Object.keys(val).length === 0;
}

function isArrayEmpty(arr:Array<any>) {
    return !arr || arr.length === 0;
}

function processObject(json:Object, output?, nested?) {
    if (nested && output) {
        output = {
            properties: output
        }
    } else {
        output = output || {}
        output.type = getType(json);
        output.properties = output.properties || {}
    }

    let uniqueStringArray = new UniqueStringArray();

    for (let key in json) {
        let type:string;
        let value = json[key];

        if (isTargetType(value, "Undefined")) {
            type = 'null'
        }
        output.properties[key] = generateSchema(value);
        uniqueStringArray.push(key);
    }
    output.required = uniqueStringArray.toArray();
    return nested ? output.properties : output
}

function processArray(array:Array<any>, output?:Schema, isNested?:boolean) {
    output = output || {} as Schema;
    output.type = getType(array);
    output.items = output.items || new Schema();

    for (var index = 0, length = array.length; index < length; index++) {
        var value = array[index];
        var itemType = getType(value);
        var required = [];
        if (isTargetType(value, 'Object') && output.items.properties) {
            let uniqueStringArray = new UniqueStringArray();
            uniqueStringArray.pushArr(Object.keys(output.items.properties));
            uniqueStringArray.pushArr(output.items.required);
            output.items.required = uniqueStringArray.toArray();
        }
        output.items.properties = generateSchema(value, output.items.properties, true);
    }

    return isNested ? output.items : output
}

export function generateSchema(json:Object|Array<any>, output?:Schema|Object, isNested?:boolean):Schema {
    if (isTargetType(json, "Object")) {
        return <Schema>processObject(json, output, isNested);
    } else if (isTargetType(json, "Array")) {
        return <Schema>processArray(json as Array<any>, output as Schema, isNested);
    } else {
        return <Schema>{type: getType(json)};
    }
}

export function json2schema(schemaTitle:string, input:Object|string|Array<any>):Schema {
    if (isObjectEmpty(input)) {
        throw new Error('index.ts: input object has no property');
    }

    if (isArrayEmpty(input as Array<any>)) {
        throw new Error('index.ts: input array is empty');
    }

    const json:Object = getJson(input);

    return extend(new Schema(SCHEMA_DRAFT_V4, schemaTitle, getType(json)), generateSchema(json));
}




