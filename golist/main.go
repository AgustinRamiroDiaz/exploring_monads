package main

import "fmt"

func main() {
	x := unit(10)
	y := bind(x, func(a int) []int { return []int{a * 1, a * 2, a * 3} })
	z := bind(y, func(a int) []string { return []string{fmt.Sprint(a), fmt.Sprint(a)} })

	fmt.Printf("%#v\n", z)
}

func unit[A any](value A) []A {
	return []A{value}
}

func fmap[A, B any](f func(A) B) func([]A) []B {
	return func(list []A) (out []B) {
		for _, value := range list {
			out = append(out, f(value))
		}
		return
	}
}

// flatten
func join[A any](listOfLists [][]A) (out []A) {
	for _, list := range listOfLists {
		out = append(out, list...)
	}
	return
}

// flatmap
func bind[A, B any](list []A, f func(A) []B) (out []B) {
	liftedFunction := fmap(f)
	listOfLists := liftedFunction(list)
	return join(listOfLists)
}
