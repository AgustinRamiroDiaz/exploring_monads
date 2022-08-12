interface Maybe<A> {
  then<B>(f: (a: A) => Maybe<B>): Maybe<B>;
  caseOf<B>(cases: { Just: (a: A) => B; Nothing: () => B }): B;
}

class Just<A> implements Maybe<A> {
  value: A;
  constructor(value: A) {
    this.value = value;
  }
  then<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    return f(this.value);
  }
  caseOf<B>(cases: { Just: (a: A) => B; Nothing: () => B }): B {
    return cases.Just(this.value);
  }
}

class Nothing implements Maybe<any> {
  then<B>(f: (a: any) => Maybe<B>): Maybe<B> {
    return new Nothing();
  }
  caseOf<B>(cases: { Just: (a: any) => B; Nothing: () => B }): B {
    return cases.Nothing();
  }
}

let x = new Just(1)
  .then((x) => new Just(x + 1))
  .then((x) => new Just("x:" + x))
  .then((x) => new Nothing())
  .then((x: number) => new Just(x + 1))
  .then((x) => new Nothing())
  .then((x: string) => new Just(x + "1"))
  .caseOf({
    Just: (x) => console.log("Finished with " + x),
    Nothing: () => console.log("whoops None"),
  });

function happyPath() {
  function splitInTwoByComma(input: string): [string, string] {
    const splitted = input.split(",");
    return [splitted[0], splitted[1]];
  }

  function toupleStringToInt([a, b]: [string, string]): [number, number] {
    return [parseInt(a), parseInt(b)];
  }

  function divideTwoNumbers([a, b]: [number, number]): number {
    return a / b;
  }

  const initialValue = "1,1";
  const splitted = splitInTwoByComma(initialValue);
  const numbers = toupleStringToInt(splitted);
  const result = divideTwoNumbers(numbers);

  console.log(result);
}

happyPath();

function notSoHappyPath() {
  function splitInTwoByComma(input: string): Maybe<[string, string]> {
    const splitted = input.split(",");
    if (splitted.length === 2) {
      return new Just([splitted[0], splitted[1]]);
    } else {
      return new Nothing();
    }
  }

  function toInt([a, b]: [string, string]): Maybe<[number, number]> {
    if (isNaN(parseInt(a)) || isNaN(parseInt(b))) {
      return new Nothing();
    } else {
      return new Just([parseInt(a), parseInt(b)]);
    }
  }

  function divideTwoNumbers([a, b]: [number, number]): Maybe<number> {
    if (b === 0) {
      return new Nothing();
    } else {
      return new Just(a / b);
    }
  }

  const initialValue = "1,1";
  const splitted = splitInTwoByComma(initialValue);
  if (splitted instanceof Just) {
    const numbers = toInt(splitted.value);
    if (numbers instanceof Just) {
      const result = divideTwoNumbers(numbers.value);
      if (result instanceof Just) {
        console.log(result.value);
      } else {
        console.log("whoops None");
      }
    } else {
      console.log("whoops None");
    }
  } else {
    console.log("whoops None");
  }
}

function notSoHappyPath() {
  function splitInTwoByComma(input: string): Maybe<[string, string]> {
    const splitted = input.split(",");
    if (splitted.length === 2) {
      return new Just([splitted[0], splitted[1]]);
    } else {
      return new Nothing();
    }
  }

  function toInt([a, b]: [string, string]): Maybe<[number, number]> {
    if (isNaN(parseInt(a)) || isNaN(parseInt(b))) {
      return new Nothing();
    } else {
      return new Just([parseInt(a), parseInt(b)]);
    }
  }

  function divideTwoNumbers([a, b]: [number, number]): Maybe<number> {
    if (b === 0) {
      return new Nothing();
    } else {
      return new Just(a / b);
    }
  }

  const initialValue = "1,1";
  const result = new Just(initialValue)
    .then(splitInTwoByComma)
    .then(toInt)
    .then(divideTwoNumbers);
  console.log(result);
}
