"use strict";
var chai_1 = require('chai');
var index_1 = require('../index');
var deepEqual = require('deep-equal');
var validate_1 = require('../src/validator/validate');
describe('json2schema()', function () {
    it('normal object case #1', function () {
        var schema = index_1.json2schema("Student", { name: 'Allen' });
        chai_1.expect(schema['$schema']).to.be.eqls('http://json-schema.org/draft-04/schema#');
        chai_1.expect(schema['title']).to.be.eqls('Student');
        chai_1.expect(schema['type']).to.be.eqls('object');
        chai_1.expect(schema['properties']).to.be.eqls({ name: { type: 'string' } });
    });
    it('normal object case #2', function () {
        var schema = index_1.json2schema("Test", {
            "Result": {
                "Age": null,
                "ApplyRemark": null,
                "CompanyName": null,
                "IsChecked": null,
                "IsScanCode": true,
                "JobTitle": null,
                "MRHeadImg": null,
                "MRKid": 0,
                "MobilePhone": null,
                "NewDoctorCount": null,
                "QRcode": null,
                "Reason": null,
                "Sex": null,
                "TrueName": null
            },
            "State": 1
        });
        chai_1.expect(deepEqual(schema, {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "properties": {
                "Result": {
                    "properties": {
                        "Age": {
                            "type": "null"
                        },
                        "ApplyRemark": {
                            "type": "null"
                        },
                        "CompanyName": {
                            "type": "null"
                        },
                        "IsChecked": {
                            "type": "null"
                        },
                        "IsScanCode": {
                            "type": "boolean"
                        },
                        "JobTitle": {
                            "type": "null"
                        },
                        "MRHeadImg": {
                            "type": "null"
                        },
                        "MRKid": {
                            "type": "number"
                        },
                        "MobilePhone": {
                            "type": "null"
                        },
                        "NewDoctorCount": {
                            "type": "null"
                        },
                        "QRcode": {
                            "type": "null"
                        },
                        "Reason": {
                            "type": "null"
                        },
                        "Sex": {
                            "type": "null"
                        },
                        "TrueName": {
                            "type": "null"
                        },
                    },
                    "required": [
                        "Age",
                        "ApplyRemark",
                        "CompanyName",
                        "IsChecked",
                        "IsScanCode",
                        "JobTitle",
                        "MRHeadImg",
                        "MRKid",
                        "MobilePhone",
                        "NewDoctorCount",
                        "QRcode",
                        "Reason",
                        "Sex",
                        "TrueName",
                    ],
                    "type": "object",
                },
                "State": {
                    "type": "number"
                },
            },
            "required": [
                "Result",
                "State"
            ],
            "title": "Test",
            "type": "object"
        })).to.be.true;
    });
    it('normal object case #3', function () {
        var json = {
            "widget": {
                "debug": "on",
                "window": {
                    "title": "Sample Konfabulator Widget",
                    "name": "main_window",
                    "width": 500,
                    "height": 500
                },
                "image": {
                    "src": "Images/Sun.png",
                    "name": "sun1",
                    "hOffset": 250,
                    "vOffset": 250,
                    "alignment": "center"
                },
                "text": {
                    "data": "Click Here",
                    "size": 36,
                    "style": "bold",
                    "name": "text1",
                    "hOffset": 250,
                    "vOffset": 100,
                    "alignment": "center",
                    "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
                }
            }
        };
        chai_1.expect(validate_1.validator.validate(json, require('../temp/schema.json')).errors.length === 0).to.be.true;
    });
    it('normal object case #4', function () {
        var json = {
            "widget1": {
                "debug": "on",
                "window": {
                    "title": "Sample Konfabulator Widget",
                    "name": "main_window",
                    "width": 500,
                    "height": 500
                },
                "image": {
                    "src": "Images/Sun.png",
                    "name": "sun1",
                    "hOffset": 250,
                    "vOffset": 250,
                    "alignment": "center"
                },
                "text": {
                    "data": "Click Here",
                    "size": 36,
                    "style": "bold",
                    "name": "text1",
                    "hOffset": 250,
                    "vOffset": 100,
                    "alignment": "center",
                    "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
                }
            }
        };
        chai_1.expect(validate_1.validator.validate(json, require('../temp/schema.json')).errors.length === 1).to.be.true;
    });
    it('normal array case #1', function () {
        var json = [
            {
                "id": 2,
                "name": "An ice sculpture",
                "price": 12.50,
                "tags": ["cold", "ice"],
                "dimensions": {
                    "length": 7.0,
                    "width": 12.0,
                    "height": 9.5
                },
                "warehouseLocation": {
                    "latitude": -78.75,
                    "longitude": 20.4
                }
            },
            {
                "id": 3,
                "name": "A blue mouse",
                "price": 25.50,
                "tags": ["cold", "ice"],
                "dimensions": {
                    "length": 3.1,
                    "width": 1.0,
                    "height": 1.0
                },
                "warehouseLocation": {
                    "latitude": 54.4,
                    "longitude": -32.7
                }
            }
        ];
        require('fs').writeFileSync('temp/temp.json', JSON.stringify(index_1.json2schema("test", json)));
        chai_1.expect(validate_1.validator.validate(json, index_1.json2schema("test", json)).errors.length === 0).to.be.true;
    });
    it('normal array case #2', function () {
        var json = [
            {
                "id": 2,
                "name": "An ice sculpture",
                "price": 12.50,
                "tags1": ["cold", "ice"],
                "dimensions": {
                    "length2": 7.0,
                    "width": 12.0,
                    "height": 9.5
                },
                "warehouseLocation": {
                    "latitude3": -78.75,
                    "longitude": 20.4
                }
            }
        ];
        chai_1.expect(validate_1.validator.validate(json, require('../temp/array-schema.json')).errors.length === 3).to.be.true;
    });
    it('throw case #1', function () {
        chai_1.expect(function () { return index_1.json2schema('test', 1); }).to.throw();
    });
    it('throw case #2', function () {
        chai_1.expect(function () { return index_1.json2schema('test', undefined); }).to.throw();
    });
    it('throw case #3', function () {
        chai_1.expect(function () { return index_1.json2schema('test', ''); }).to.throw();
    });
    it('throw case #4', function () {
        chai_1.expect(function () { return index_1.json2schema('test', void 0); }).to.throw();
    });
    it('throw case #5', function () {
        chai_1.expect(function () { return index_1.json2schema('test', null); }).to.throw();
    });
    it('throw case #6', function () {
        chai_1.expect(function () { return index_1.json2schema('test', {}); }).to.throw();
    });
    it('throw case #7', function () {
        chai_1.expect(function () { return index_1.json2schema('test', []); }).to.throw();
    });
});
//# sourceMappingURL=json2schema.js.map