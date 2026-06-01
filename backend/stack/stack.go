package stack

import "fmt"

type Stack[T any] []T

func NewStack[T any]() *Stack[T] {
	return &Stack[T]{}
}

func (s *Stack[T]) Push(value T) {
	*s = append(*s, value)
}

func (s Stack[T]) Peek() T {
	return s[len(s)-1]
}

func (s *Stack[T]) Pop() T {
	result := (*s)[len(*s)-1]
	*s = (*s)[:len(*s)-1]
	return result
}

func (s Stack[T]) IsEmpty() bool {
	if len(s) == 0 {
		return true
	}
	return false
}

func (s *Stack[T]) Print() {
	fmt.Print("[")

	for _, val := range *s {
		fmt.Print(val, ", ")
	}

	fmt.Print("]")
}
