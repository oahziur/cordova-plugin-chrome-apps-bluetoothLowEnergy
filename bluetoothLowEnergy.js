// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var Event = require('cordova-plugin-chrome-apps-common.events');
var exec = require('cordova/exec');
var callbackWithError = require('cordova-plugin-chrome-apps-common.errors').callbackWithError;

var fail = function(callback) {
    return callback && function(msg) {
        callbackWithError(msg, callback);
    };
};

var validateServiceId = function(serviceId) {
    var parts = serviceId.split('/');
    return parts.length === 2;
};

var validateCharacteristicId = function(characteristicId) {
    var parts = characteristicId.split('/');
    return parts.length === 3;
};

var validateDescriptorId = function(descriptorId) {
    var parts = descriptorId.split('/');
    return parts.length === 4;
};

exports.connect = function(deviceAddress, properties, callback) {
    if (typeof properties == 'function') {
        callback = properties;
        properties = {};
    }
    exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'connect', [deviceAddress, properties]);
};

exports.disconnect = function(deviceAddress, callback) {
    exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'disconnect', [deviceAddress]);
};

exports.getService = function(serviceId, callback) {
    if (validateServiceId(serviceId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'getService', [serviceId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.getServices = (function() {
    // A Map stores getServices' callbacks. Key is the deviceAddress, and value
    // is an array of callback.
    var getServicesCallbacks = {};

    return function(deviceAddress, callback) {
        if (getServicesCallbacks[deviceAddress] !== undefined) {
            getServicesCallbacks[deviceAddress].push(callback);
        } else {
            getServicesCallbacks[deviceAddress] = [callback];

            var handleWin = function(arg) {
                getServicesCallbacks[deviceAddress].forEach(function(callback) {
                    callback(arg);
                });
                delete getServicesCallbacks[deviceAddress];
            };

            var handleFail = function(arg) {
                getServicesCallbacks[deviceAddress].forEach(function(callback) {
                    (fail(callback)(arg));
                });
                delete getServicesCallbacks[deviceAddress];
            };

            exec(handleWin, handleFail, 'ChromeBluetoothLowEnergy', 'getServices', [deviceAddress]);
        }
    };
}());

exports.getCharacteristic = function(characteristicId, callback) {
    var win = callback && function(uuid, service, properties, instanceId, value) {
        var info = {
            uuid: uuid,
            service: service,
            properties: properties,
            instanceId: instanceId,
            value: value
        };
        callback(info);
    };

    if (validateCharacteristicId(characteristicId)) {
        exec(win, fail(callback), 'ChromeBluetoothLowEnergy', 'getCharacteristic', [characteristicId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.getCharacteristics = function(serviceId, callback) {
    if (validateServiceId(serviceId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'getCharacteristics', [serviceId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.getIncludedServices = function(serviceId, callback) {
    if (validateServiceId(serviceId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'getIncludedServices', [serviceId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.getDescriptor = function(descriptorId, callback) {
    var win = callback && function(uuid, characteristic, instanceId, value) {
        var info = {
            uuid: uuid,
            characteristic: characteristic,
            instanceId: instanceId,
            value: value
        };
        callback(info);
    };
    if (validateDescriptorId(descriptorId)) {
        exec(win, fail(callback), 'ChromeBluetoothLowEnergy', 'getDescriptor', [descriptorId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.getDescriptors = function(characteristicId, callback) {

    if (validateCharacteristicId(characteristicId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'getDescriptors', [characteristicId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.readCharacteristicValue = function(characteristicId, callback) {
    var win = callback && function(uuid, service, properties, instanceId, value) {
        var info = {
            uuid: uuid,
            service: service,
            properties: properties,
            instanceId: instanceId,
            value: value
        };
        callback(info);
    };

    if (validateCharacteristicId(characteristicId)) {
        exec(win, fail(callback), 'ChromeBluetoothLowEnergy', 'readCharacteristicValue', [characteristicId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.writeCharacteristicValue = function(characteristicId, value, callback) {

    if (validateCharacteristicId(characteristicId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'writeCharacteristicValue', [characteristicId, value]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }


};

exports.startCharacteristicNotifications = function(characteristicId, properties, callback) {
    if (typeof properties == 'function') {
        callback = properties;
        properties = {};
    }

    if (validateCharacteristicId(characteristicId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'startCharacteristicNotifications', [characteristicId, properties]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.stopCharacteristicNotifications = function(characteristicId, callback) {

    if (validateCharacteristicId(characteristicId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'stopCharacteristicNotifications', [characteristicId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.readDescriptorValue = function(descriptorId, callback) {
    var win = callback && function(uuid, characteristic, instanceId, value) {
        var info = {
            uuid: uuid,
            characteristic: characteristic,
            instanceId: instanceId,
            value: value
        };
        callback(info);
    };

    if (validateDescriptorId(descriptorId)) {
        exec(win, fail(callback), 'ChromeBluetoothLowEnergy', 'readDescriptorValue', [descriptorId]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.writeDescriptorValue = function(descriptorId, value, callback) {

    if (validateDescriptorId(descriptorId)) {
        exec(callback, fail(callback), 'ChromeBluetoothLowEnergy', 'writeDescriptorValue', [descriptorId, value]);
    } else {
        callbackWithError('Invalid instanceId', callback);
    }
};

exports.onServiceAdded = new Event('onServiceAdded');
exports.onServiceChanged = new Event('onServiceChanged');
exports.onServiceRemoved = new Event('onServiceRemoved');
exports.onCharacteristicValueChanged = new Event('onCharacteristicValueChanged');
exports.onDescriptorValueChanged = new Event('onDescriptorValueChanged');

function registerEvents() {
    var onEventsCallback = function(eventType) {
        switch (eventType) {
        case 'onServiceAdded':
            exports.onServiceAdded.fire(arguments[1]);
            break;
        case 'onServiceChanged':
            exports.onServiceChanged.fire(arguments[1]);
            break;
        case 'onServiceRemoved':
            exports.onServiceChanged.fire(arguments[1]);
            break;
        case 'onCharacteristicValueChanged':
            var info = {
                uuid: arguments[1],
                service: arguments[2],
                properties: arguments[3],
                instanceId: arguments[4],
                value: arguments[5]
            };
            exports.onCharacteristicValueChanged.fire(info);
            break;
        case 'onDescriptorValueChanged':
            var info = {
                uuid: arguments[1],
                characteristic: arguments[2],
                instanceId: arguments[3],
                value:arguments[4]
            };
            exports.onDescriptorValueChanged.fire(info);
            break;
        }
    };

    exec(onEventsCallback, null, 'ChromeBluetoothLowEnergy', 'registerBluetoothLowEnergyEvents', []);
}

require('cordova-plugin-chrome-apps-common.helpers').runAtStartUp(registerEvents);
