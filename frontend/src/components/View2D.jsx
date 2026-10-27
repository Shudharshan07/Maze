import React, { useEffect, useRef } from 'react';


// fix the overflow with canvas ??
export default function View2D({ maze }) {
    const canvasRef = useRef(null);
    const board = maze?.Board || [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || board.length === 0) return;

        const ctx = canvas.getContext('2d');

        const rows = board.length;
        const cols = board[0].length;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, rect.width, rect.height);

        const cellWidth = canvas.width / cols;
        const cellHeight = canvas.height / rows;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const isWall = board[r][c];
                ctx.fillStyle = isWall ? '#ffffff' : '#000000';

                ctx.fillRect(
                    c * cellWidth, 
                    r * cellHeight, 
                    Math.ceil(cellWidth), 
                    Math.ceil(cellHeight)
                );
            }
        }

    }, [board])

    return (
       <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '1 / 1',
                display: 'block',
                imageRendering: 'pixelated', // Keeps edges crisp during rendering mutations
            }} 
        />
    )
}