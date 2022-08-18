package main

import "fmt"

func main() {

	plusOne := func(a int) Result[int] { return newValue(a + 1) }
	nope := func(a int) Result[int] { return newError[int](fmt.Errorf("nope")) }

	x := newValue(1)
	y := x.Then(plusOne).Then(nope).Then(plusOne)

	fmt.Println(y.String())

	a := newValue(1)
	b := then(a, plusOne)
	c := then(b, nope)
	d := then(c, plusOne)

	fmt.Println(d.String())

}

type Result[A any] struct {
	value A
	err   error
}

func (r Result[A]) String() string {
	if r.err != nil {
		return fmt.Sprintf("err: %s", r.err)
	}
	return fmt.Sprintf("value: %v", r.value)
}

func newError[A any](err error) Result[A] {
	return Result[A]{err: err}
}

func newValue[A any](value A) Result[A] {
	return Result[A]{value: value}
}

func (r Result[A]) Value() A {
	return r.value
}

func (r Result[A]) Error() error {
	return r.err
}

func (r Result[A]) Then(f func(A) Result[A]) Result[A] {
	if r.err != nil {
		return newError[A](r.err)
	}
	return f(r.value)
}

func then[A, B any](r Result[A], f func(A) Result[B]) Result[B] {
	if r.err != nil {
		return Result[B]{err: r.err}
	}
	return f(r.value)
}
