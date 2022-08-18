interface Maybe<A> {
  bind<B>(f: (a: A) => Maybe<B>): Maybe<B>; // >>=
  caseOf<B>(cases: { Just: (a: A) => B; Nothing: () => B }): B;
}

class Just<A> implements Maybe<A> {
  value: A;
  constructor(value: A) {
    this.value = value;
  }
  bind<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    return f(this.value);
  }
  caseOf<B>(cases: { Just: (a: A) => B; Nothing: () => B }): B {
    return cases.Just(this.value);
  }
}

class Nothing implements Maybe<any> {
  bind<B>(_: (a: any) => Maybe<B>): Maybe<B> {
    return new Nothing();
  }
  caseOf<B>(cases: { Just: (a: any) => B; Nothing: () => B }): B {
    return cases.Nothing();
  }
}

function print<T>(m: Maybe<T>) {
  m.caseOf({
    Just: (x) => console.log("Just ", x),
    Nothing: () => console.log("None"),
  });
}

function happyPath() {
  function splitInTwoByComma(input: string): [string, string] {
    const splitted = input.split(",");
    return [splitted[0], splitted[1]];
  }

  function toupleStringToNumber([a, b]: [string, string]): [number, number] {
    return [parseInt(a), parseInt(b)];
  }

  function divideTwoNumbers([a, b]: [number, number]): number {
    return a / b;
  }

  function wholeProgram(input: string): number {
    const splitted = splitInTwoByComma(input);
    const numbers = toupleStringToNumber(splitted);
    return divideTwoNumbers(numbers);
  }

  console.log(wholeProgram("2,1"));
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

  function wholeProgram(input: string): Maybe<number> {
    const splitted = splitInTwoByComma(input);
    if (splitted instanceof Just) {
      const numbers = toInt(splitted.value);
      if (numbers instanceof Just) {
        const result = divideTwoNumbers(numbers.value);
        if (result instanceof Just) {
          return result;
        } else {
          return new Nothing();
        }
      } else {
        return new Nothing();
      }
    } else {
      return new Nothing();
    }
  }

  console.log(wholeProgram("1,3"));
  console.log(wholeProgram("6,2"));
}

function monadPath() {
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

  function wholeProgram(input: string): Maybe<number> {
    return new Just(input)
      .bind(splitInTwoByComma)
      .bind(toInt)
      .bind(divideTwoNumbers);
  }

  print(wholeProgram("10,5"));

  print(wholeProgram("1,1,2"));
}
// monadPath();

// return
function unit<A>(a: A): Maybe<A> {
  return new Just(a);
}

// lift
function fmap<A, B>(f: (a: A) => B): (ma: Maybe<A>) => Maybe<B> {
  return (maybe: Maybe<A>) => {
    return maybe.caseOf({
      Just: (a) => new Just(f(a)),
      Nothing: () => new Nothing(),
    });
  };
}

function join<A>(mma: Maybe<Maybe<A>>): Maybe<A> {
  // flat
  return mma.caseOf({
    Just: (ma) => ma,
    Nothing: () => new Nothing(),
  });
}

function joinAfter<A>(f: (a: A) => Maybe<Maybe<A>>): (a: A) => Maybe<A> {
  return (a) => join(f(a));
}

function kleisli<A, B, C>( // kleisli arrow, fish operator >=>
  f: (a: A) => Maybe<B>,
  g: (b: B) => Maybe<C>
): (ma: A) => Maybe<C> {
  return (a: A) => {
    return f(a).bind(g);
  };
}

function compose<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a: A) => g(f(a));
}

function experiments() {
  const w = new Just(1)
    .bind(
      kleisli(
        compose(
          (x: number) => new Just(x * 2),
          fmap((x: number) => x * 2)
        ),
        (x) => new Just(x + 1)
      )
    )
    .bind(
      kleisli(
        joinAfter<number>(
          compose<number, Maybe<number>, Maybe<Maybe<number>>>(
            (x: number) => new Just(x * 2),
            fmap((x: number) => new Just(x * 2))
          )
        ),
        (x) => new Just(x + 1)
      )
    );

  console.log(w);
}
