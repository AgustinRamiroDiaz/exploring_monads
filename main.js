var Just = /** @class */ (function () {
    function Just(value) {
        this.value = value;
    }
    Just.prototype.bind = function (f) {
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
    Nothing.prototype.bind = function (f) {
        return new Nothing();
    };
    Nothing.prototype.caseOf = function (cases) {
        return cases.Nothing();
    };
    return Nothing;
}());
var x = new Just(1)
    .bind(function (x) { return new Just(x + 1); })
    .bind(function (x) { return new Just("x:" + x); })
    .bind(function (x) { return new Nothing(); })
    .bind(function (x) { return new Just(x + 1); })
    .bind(function (x) { return new Nothing(); })
    .bind(function (x) { return new Just(x + "1"); })
    .caseOf({
    Just: function (x) { return console.log("Finished with " + x); },
    Nothing: function () { return console.log("whoops None"); }
});
function happyPath() {
    function splitInTwoByComma(input) {
        var splitted = input.split(",");
        return [splitted[0], splitted[1]];
    }
    function toupleStringToInt(_a) {
        var a = _a[0], b = _a[1];
        return [parseInt(a), parseInt(b)];
    }
    function divideTwoNumbers(_a) {
        var a = _a[0], b = _a[1];
        return a / b;
    }
    var initialValue = "1,1";
    var splitted = splitInTwoByComma(initialValue);
    var numbers = toupleStringToInt(splitted);
    var result = divideTwoNumbers(numbers);
    console.log(result);
}
happyPath();
function notSoHappyPath() {
    function splitInTwoByComma(input) {
        var splitted = input.split(",");
        if (splitted.length === 2) {
            return new Just([splitted[0], splitted[1]]);
        }
        else {
            return new Nothing();
        }
    }
    function toInt(_a) {
        var a = _a[0], b = _a[1];
        if (isNaN(parseInt(a)) || isNaN(parseInt(b))) {
            return new Nothing();
        }
        else {
            return new Just([parseInt(a), parseInt(b)]);
        }
    }
    function divideTwoNumbers(_a) {
        var a = _a[0], b = _a[1];
        if (b === 0) {
            return new Nothing();
        }
        else {
            return new Just(a / b);
        }
    }
    var initialValue = "1,1";
    var splitted = splitInTwoByComma(initialValue);
    if (splitted instanceof Just) {
        var numbers = toInt(splitted.value);
        if (numbers instanceof Just) {
            var result = divideTwoNumbers(numbers.value);
            if (result instanceof Just) {
                console.log(result.value);
            }
            else {
                console.log("whoops None");
            }
        }
        else {
            console.log("whoops None");
        }
    }
    else {
        console.log("whoops None");
    }
}
function monadPath() {
    function splitInTwoByComma(input) {
        var splitted = input.split(",");
        if (splitted.length === 2) {
            return new Just([splitted[0], splitted[1]]);
        }
        else {
            return new Nothing();
        }
    }
    function toInt(_a) {
        var a = _a[0], b = _a[1];
        if (isNaN(parseInt(a)) || isNaN(parseInt(b))) {
            return new Nothing();
        }
        else {
            return new Just([parseInt(a), parseInt(b)]);
        }
    }
    function divideTwoNumbers(_a) {
        var a = _a[0], b = _a[1];
        if (b === 0) {
            return new Nothing();
        }
        else {
            return new Just(a / b);
        }
    }
    var initialValue = "1,1";
    var result = new Just(initialValue)
        .bind(splitInTwoByComma)
        .bind(toInt)
        .bind(divideTwoNumbers)
        .caseOf({
        Just: function (x) { return console.log(x); },
        Nothing: function () { return console.log("whoops None"); }
    });
}
