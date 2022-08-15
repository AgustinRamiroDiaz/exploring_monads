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
  bind<B>(f: (a: any) => Maybe<B>): Maybe<B> {
    return new Nothing();
  }
  caseOf<B>(cases: { Just: (a: any) => B; Nothing: () => B }): B {
    return cases.Nothing();
  }
}

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

  const initialValue = "1,1";
  const result = new Just(initialValue)
    .bind(splitInTwoByComma)
    .bind(toInt)
    .bind(divideTwoNumbers)
    .caseOf({
      Just: (x) => console.log(x),
      Nothing: () => console.log("whoops None"),
    });
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
  const a = compose(
    (x: number) => new Just(x * 2),
    fmap((x) => x * 2)
  );

  const z = compose<number, Maybe<number>, Maybe<Maybe<number>>>(
    (x: number) => new Just(x * 2),
    fmap((x: number) => new Just(x * 2))
  );

  const x = new Just(1)
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

  console.log(x);
}

experiments();
