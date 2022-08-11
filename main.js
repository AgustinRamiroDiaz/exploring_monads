var Some = /** @class */ (function () {
    function Some(value) {
        this.value = value;
    }
    Some.prototype.then = function (f) {
        console.log(this.value);
        return f(this.value);
    };
    return Some;
}());
var None = /** @class */ (function () {
    function None() {
    }
    None.prototype.then = function (f) {
        console.log("None");
        return new None();
    };
    return None;
}());
var x = new Some(1)
    .then(function (x) { return new Some(x + 1); })
    .then(function (x) { return new Some("x:" + x); })
    .then(function (x) { return new None(); })
    .then(function (x) { return new Some(x + 1); })
    .then(function (x) { return new None(); })
    .then(function (x) { return new Some(x + "1"); });
