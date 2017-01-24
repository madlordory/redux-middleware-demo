

class d {
    constructor (type) {
        this.type=type;
    }

    get PENDING () {
        return this.type+"_PENDING"
    }

    get FULFILLED () {
        return this.type+"_FULFILLED"

    }

    get REJECT () {
        return this.type+"_REJECT"

    }

    valueOf() {
        return this.type
    }

    toString() {
        return this.type
    }
}


let s=new d("abc");
console.log(s.PENDING);
switch (s) {
    case s:
        console.log("dd");
        break;
    case s.PENDING:
        console.log("ee");
    default:
        break;
}