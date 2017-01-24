/**
 * Created by madlord on 2017/1/22.
 */
"use strict";
import __map from 'lodash/map';

export default class Spec {
    constructor(value) {
        this.value = value;
    }

    compose (...specs) {
        let result = this.value;
        specs && __map(specs, ({value}) => {
            result = value | result;
        })
        return new Spec(result);
    }

    include ({value}) {
        return this.value==(this.value|value);
    }

    isMe ({value}) {
        return value==(value|this.value);
    }
}

