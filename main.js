var Just = /** @class */ (function () {
    function Just(value) {
        this.value = value;
    }
    Just.prototype.then = function (f) {
        console.log(this.value);
        return f(this.value);
    };
    Just.prototype.caseOf = function (cases) {
        return cases.Just(this.value);
    };
    return Just;
}());
var Nothing = /** @class */ (function () {
    function Nothing() {
    }
    Nothing.prototype.then = function (f) {
        console.log("None");
        return new Nothing();
    };
    Nothing.prototype.caseOf = function (cases) {
        return cases.Nothing();
    };
    return Nothing;
}());
var x = new Just(1)
    .then(function (x) { return new Just(x + 1); })
    .then(function (x) { return new Just("x:" + x); })
    .then(function (x) { return new Nothing(); })
    .then(function (x) { return new Just(x + 1); })
    .then(function (x) { return new Nothing(); })
    .then(function (x) { return new Just(x + "1"); })
    .caseOf({
    Just: function (x) { return console.log("Finished with " + x); },
    Nothing: function () { return console.log("whoops None"); }
});
