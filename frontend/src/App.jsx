import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import View2D from './components/View2D';
import View3D from './components/View3D';
import GetMaze from './api/data';


function App() {

	const [width, setWidth] = useState(39)
	const [height, setHeight] = useState(39)
	const [maze, setMaze] = useState(null)
	const [is3D, setIs3D] = useState(false);

	const handleGenerate = async () => {		
		try {
			const NewMaze = await GetMaze(Number(width), Number(height))
			setMaze(NewMaze)
		} catch (error) {
			console.error("Failed to fetch maze data:", error);
		}
	};	

	useEffect(() => {
		const handleClose = () => {
			navigator.sendBeacon('/close')
		}
		
		window.addEventListener('pagehide', handleClose);

		return () => {
			window.removeEventListener('pagehide', handleClose)
		};
	}, []);

	const hasMazeData = maze && (Array.isArray(maze) ? maze.length > 0 : maze.Board?.length > 0);

  return (
    <>
	<div className='app'>
		<div className='maze-container'>
			{
				hasMazeData ? (
					is3D ? <View3D maze={maze} /> : <View2D maze={maze} />
				) : (
				<div style={{ color: '#ef4444', fontWeight: 'bold' }}>No map loaded.</div>
				)
			}

		{/* <div className='maze-grid'>
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
		</div> */}
		</div>
		<div className='panel'>
			<div className="input-group">
			<label>View Mode</label>
			<div className="switch-container">
				<span className={`switch-label ${!is3D ? 'active' : ''}`}>2D</span>
				
				<label className="switch">
				<input 
					type="checkbox" 
					checked={is3D} 
					onChange={() => setIs3D(!is3D)} 
				/>
				<span className="slider"></span>
				</label>
				
				<span className={`switch-label ${is3D ? 'active' : ''}`}>3D</span>
			</div>
			</div>

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
