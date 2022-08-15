// interface List<A> {
//     bind<B>(f: (a: A) => List<B>): List<B>;
// }

// class List<A> {
//     value : A[];
//     constructor(value: A[]) {
//         this.value = value;
//     }
//     bind<B>(f: (a: A) => List<B>): List<B> {
//         return new List(this.value.flatMap(f));
//     }
// }

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

function kleisli<A, B, C>( // kleisli arrow, fish operator >=>
  f: (a: A) => Maybe<B>,
  g: (b: B) => Maybe<C>
): (ma: A) => Maybe<C> {
  return (a: A) => {
    return f(a).bind(g);
  };
}

const result = new Just(1)
  .bind((x) => new Just(x * 2))
  .bind((x) => new Just(x + 1));

const sameResult = new Just(1).bind(
  kleisli(
    (x) => new Just(x * 2),
    (x) => new Just(x + 1)
  )
);

console.log(result == sameResult);
