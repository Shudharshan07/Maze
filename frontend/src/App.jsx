import { useEffect, useState } from 'react'
import GetMaze from '../src/api/data'
import './App.css'

function App() {

	const [width, setWidth] = useState(39)
	const [height, setHeight] = useState(39)
	const [maze, setMaze] = useState({ Board: [] })

	const handleGenerate = async () => {
		const NewMaze = await GetMaze(Number(width), Number(height))
		setMaze(NewMaze)
	}	

	useEffect(() => {
		const handleClose = () => {
			navigator.sendBeacon('/close')
		}
		
		window.addEventListener('pagehide', handleClose);

		return () => {
			window.removeEventListener('pagehide', handleClose)
		};
	}, []);
  
  return (
    <>
	<div className='app'>
		<div className='maze-container'>
		<div className='maze-grid'>
			{
				maze?.Board.map((row, rowIndex) => (
					<div key={rowIndex} className="maze-row">
						{
							row.map((cell, cellIndex) => (
								<div
									key={cellIndex}
									className={`maze-cell cell-${cell}`} 
                                />
							))
						}
					</div>
				))
			}
		</div>
		</div>
		<div className='panel'>
			<div className='input-group'>
				<label htmlFor="width">Width</label>
				<input 
					id="width"
					type="number" 
					value={width} 
					onChange={(e) => setWidth(e.target.value)} 
					min="5" 
					max="50"
				/>
			</div>
			<div className='input-group'>
				<label htmlFor="height">height</label>
				<input 
					id="height"
					type="number" 
					value={height} 
					onChange={(e) => setHeight(e.target.value)} 
					min="5" 
					max="50"
				/>
			</div>
			<button onClick={handleGenerate} className='generate-btn'>
			Generate Maze
			</button>
		</div>
	</div>
    </>
  )
}

export default App
