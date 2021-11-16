// ObjectMap is a vue & serilization friendly javascript object based Map.
// ObjectMap only support string as item key, and plain object or primitives as item value (except 'undefined').

import Vue from "vue";

export function ObjectMap() {
    // get item value, return undefined if item not found
    this.getMapItem = function(key) {
        console.assert(key && key.toString().length > 0);
        let realKey = "omi-" + key;

        if (this.hasOwnProperty(realKey))
            return this[realKey];
        else
            return undefined;
    };

    // get item value by key
    // note: set value to undefined will delete this item
    this.setMapItem = function(key,value) {
        console.assert(key && key.toString().length > 0);
        let realKey = "omi-" + key;

        if (value == undefined) {
            delete this[realKey];
            this.mapItemsCount--;
        }
        else {
            if (!this.hasOwnProperty(realKey))
                this.mapItemsCount++;
            //this[realKey] = value;
            Vue.set(this,realKey,value);
        }
    };

    // item count
    this.mapItemsCount = 0;

    // get all item's keys
    this.mapItemKeys = function() {
        this.keys().filter(key => key.startsWith("omi-"));
    };

    this.getKeysFromJo = function(jo) {
        //console.log("!!!!!!!!", jo);
        let keys = [];
        for (const [key, value] of Object.entries(jo)) {
            //console.log("!!!!!!!!", key, value);
            if (key.startsWith("omi-")) {
                let rawkey = key.substr(4);
                keys.push(rawkey);
            }
        }
        //console.log("!!!!!!!!", keys);
        return keys;
    };

    // load items from a json object.
    // can optionally convert item value by using valueParser before add item to map.
    this.loadFromJo = function(jo, valueParser) {
        //console.log("loadFromJo", jo, valueParser);

        for (const [key, value] of Object.entries(jo)) {
            //console.log("!!!!!!!!", key, value);
            if (key.startsWith("omi-")) {
                let rawkey = key.substr(4);
                this.setMapItem(rawkey, valueParser ? valueParser(jo[key]) : jo[key]);
            }
        }
    };

};
