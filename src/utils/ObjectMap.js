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
            Vue.set(this,realKey,value);
        }
    }

    // item count
    this.mapItemsCount = 0;

    // get all item's keys
    this.mapItemKeys = function() {
        this.keys().filter(key => key.startsWith("omi-"));
    };
};
