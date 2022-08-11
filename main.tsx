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
    console.log(this.value);
    return f(this.value);
  }
  caseOf<B>(cases: { Just: (a: A) => B; Nothing: () => B }): B {
    return cases.Just(this.value);
  }
}

class Nothing implements Maybe<any> {
  then<B>(f: (a: any) => Maybe<B>): Maybe<B> {
    console.log("None");
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
