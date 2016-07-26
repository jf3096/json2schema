/**
 * Created by allen on 2016/7/26 0026.
 */

interface IValidator {
    validate:(json:Object, schema:Object)=>any
}

let Validator = require('jsonschema').Validator;
export const validator:IValidator = new Validator();
