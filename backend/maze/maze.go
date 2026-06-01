package maze

import (
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"math/rand"
	"maze/stack"
	"os"
)

type Maze struct {
	Width  int      `json:"Width"`
	Height int      `json:"Height"`
	Board  [][]bool `json:"Board"`
}

func NewMaze(width, height uint) *Maze {
	m := &Maze{
		Width:  int(width),
		Height: int(height),
	}
	m.Board = make([][]bool, m.Height)
	for i := 0; i < m.Height; i++ {
		m.Board[i] = make([]bool, m.Width)
	}

	m.CarvePath()

	return m
}

// Core
func (m *Maze) CarvePath() {
	dirs := [4]Position{{0, 2}, {0, -2}, {2, 0}, {-2, 0}}

	stack := stack.NewStack[Position]()
	stack.Push(NewPosition(0, 0))

	m.Board[0][0] = true

	for stack.IsEmpty() == false {
		tmp := stack.Peek()

		valid_path := make([]Position, 0)

		for _, dir := range dirs {
			x := tmp[0] + dir[0]
			y := tmp[1] + dir[1]

			if x >= 0 && x < m.Height && y >= 0 && y < m.Width && m.Board[x][y] == false {
				valid_path = append(valid_path, Position{x, y})
			}
		}

		if len(valid_path) == 0 {
			stack.Pop()
			continue
		}

		idx := rand.Intn(len(valid_path))
		selected := valid_path[idx]

		x := (tmp[0] + selected[0]) / 2
		y := (tmp[1] + selected[1]) / 2

		m.Board[x][y] = true
		m.Board[selected[0]][selected[1]] = true

		stack.Push(selected)
	}
}

// Utils
func (m *Maze) Print() {
	for i := 0; i < m.Height; i++ {
		for j := 0; j < m.Width; j++ {
			if m.Board[i][j] {
				fmt.Print(1, " ")
			} else {
				fmt.Print(0, " ")
			}
		}
		fmt.Print("\n")
	}
}

func (m *Maze) SaveImage(filename string) {
	upleft := image.Point{0, 0}
	downRight := image.Point{m.Width, m.Height}

	img := image.NewGray(image.Rectangle{upleft, downRight})

	for i := 0; i < m.Width; i++ {
		for j := 0; j < m.Height; j++ {
			if m.Board[j][i] == true {
				img.Set(i, j, color.White)
			}
		}
	}

	f, err := os.Create(filename)
	if err != nil {
		panic(err)
	}

	err = png.Encode(f, img)
	if err != nil {
		panic(err)
	}
}

func (m *Maze) ToJson() []byte {
	obj, err := json.Marshal(m)

	if err != nil {
		fmt.Print("Invalid Maze")
	}

	return obj
}
