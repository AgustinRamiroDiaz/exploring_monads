package main

import "fmt"

func main() {
	fmt.Println("hello world")

	x := newValue[int](1)
	y := x.Then(func(a int) Result[int] {
		return newValue[int](a + 1)
	}).Then(func(a int) Result[int] {
		return newError[int](fmt.Errorf("nope"))
	}).Then(func(a int) Result[int] {
		return newValue[int](a + 1)
	})

	value, err := y.Value(), y.Error()

	fmt.Printf("%+v - %+v\n", value, err)
}

type Result[A any] struct {
	value A
	err   error
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

func Then[A, B any](r Result[A], f func(A) Result[B]) Result[B] {
	if r.err != nil {
		return Result[B]{err: r.err}
	}
	return f(r.value)
}
