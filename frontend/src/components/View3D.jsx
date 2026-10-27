import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export default function View3D({ maze }) {
  const board = maze?.Board || [];

  const WALL_SIZE = 1;

  // Dynamically calculate the center of the generated maze
  const centerZ = (board.length * WALL_SIZE) / 2;
  const centerX = (board[0]?.length * WALL_SIZE) / 2 || 0;

  return (
    <div style={{ width: '100%', height: '100%', minWidth: '400px', minHeight: '400px' }}>
      <Canvas 
        shadows 
        camera={{ position: [centerX, Math.max(centerX, centerZ) * 1.5, centerZ * 2.2], fov: 45 }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight 
          position={[centerX + 5, 15, centerZ + 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX - 0.5, 0, centerZ - 0.5]} receiveShadow>
          <planeGeometry args={[centerX * 3, centerZ * 3]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>

        {/* Walls */}
        <group>
          {board.map((row, rowIndex) => 
            row.map((isWall, colIndex) => isWall && (
              <mesh 
                key={`3d-${rowIndex}-${colIndex}`} 
                position={[colIndex, WALL_SIZE / 2, rowIndex]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[WALL_SIZE, WALL_SIZE, WALL_SIZE]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
              </mesh>
            ))
          )}
        </group>
        
        <OrbitControls target={[centerX, 0, centerZ]} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
    </div>
  );
}