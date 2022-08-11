package main

import "fmt"

func main() {
	fmt.Println("hello world")

	plusOne := func(x int) Maybe[int] {
		return Maybe[int]{value: x + 1}
	}

	Then(
		Then(plusOne(1), plusOne),
		plusOne,
	)

	x := newValue[int, int](1)
	y := x.Then(func(a int) Result[int, int] {
		return newValue[int, int](a + 1)
	}).Then(func(a int) Result[int, int] {
		return newValue[int, int](a + 1)
	}).Then(func(a int) Result[int, int] {
		return newError[int, int](fmt.Errorf("nope"))
	}).Then(func(a int) Result[int, int] {
		return newValue[int, int](a + 1)
	})

	value, err := y.Value(), y.Error()

	fmt.Printf("%+v - %+v\n", value, err)
}

type Result[A, B any] struct {
	value A
	err   error
}

func newError[A, B any](err error) Result[A, B] {
	return Result[A, B]{err: err}
}

func newValue[A, B any](value A) Result[A, B] {
	return Result[A, B]{value: value}
}

func (r Result[A, B]) Value() A {
	return r.value
}

func (r Result[A, B]) Error() error {
	return r.err
}

func (r Result[A, B]) Then(f func(A) Result[A, B]) Result[A, B] {
	if r.err != nil {
		return newError[A, B](r.err)
	}
	return f(r.value)
}

type Maybe[A any] struct {
	value A
	err   error
}

func Then[A, B any](m Maybe[A], f func(A) Maybe[B]) Maybe[B] {
	if m.err != nil {
		return Maybe[B]{err: m.err}
	}
	return f(m.value)
}
