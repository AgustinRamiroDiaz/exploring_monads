interface Option<A> {
  then<B>(f: (a: A) => Option<B>): Option<B>;
}

class Some<A> implements Option<A> {
  value: A;
  constructor(value: A) {
    this.value = value;
  }
  then<B>(f: (a: A) => Option<B>): Option<B> {
    console.log(this.value);
    return f(this.value);
  }
}

class None implements Option<any> {
  then<B>(f: (a: any) => Option<B>): Option<B> {
    console.log("None");
    return new None();
  }
}

let x = new Some(1)
  .then((x) => new Some(x + 1))
  .then((x) => new Some("x:" + x))
  .then((x) => new None())
  .then((x: number) => new Some(x + 1))
  .then((x) => new None())
  .then((x: string) => new Some(x + "1"));
