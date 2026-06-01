package maze

type Position [2]int

func NewPosition(x, y int) Position {
	return [2]int{x, y}
}
