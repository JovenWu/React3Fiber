import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Wall from "./components/Wall";
import Card from "./components/Card";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./styles.css";

const App = () => {
  const [isAnyCardAnimating, setIsAnyCardAnimating] = useState(false);

  const cardPositions = [
    { x: 1.2, y: 1.145, z: 3 },
    { x: 1.9, y: 1.145, z: 2 },
    { x: -2, y: 1.4, z: 1 },
    { x: 2, y: 0.5, z: -2 },
    { x: 3, y: 0.5, z: 1 },
    { x: 4, y: 0.5, z: 3 },
  ];
  const { scene } = useGLTF("/room.glb");
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  return (
    <Canvas 
    camera={{ fov: 75, position: [7, 7, 7] }}
    shadows // Enable shadows in the Canvas
  >
    {/* Add ambient light for overall scene illumination */}
    <ambientLight intensity={0.5} />
    
    {/* Modify directional lights to cast shadows */}
    <directionalLight 
      position={[-2, 15, -2]} 
      intensity={1}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
    <directionalLight 
      position={[5, 5, 5]} 
      intensity={1}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />

    <Wall size={[10, 10, 1]} position={[0, 5.5, -7]} />
    <Wall size={[1, 10, 15]} position={[-4.5, 5.5, 0]} />
    
    {/* Enable shadow receiving on the floor */}
    <mesh receiveShadow>
      <boxGeometry args={[10, 1, 15]} />
      <meshLambertMaterial color={0xfffaec} />
    </mesh>

    {cardPositions.map((position, index) => (
      <Card 
        key={index} 
        position={position} 
        setIsAnyCardAnimating={setIsAnyCardAnimating}
        isAnyCardAnimating={isAnyCardAnimating}
      />
    ))}

    {/* Add the model */}
    <primitive 
      object={scene} 
      position={[2, 0.91, 2]} 
      scale={2}
    />

    <OrbitControls 
      enablePan={false} 
      enableDamping 
      dampingFactor={0.008} 
      minDistance={10} 
      maxDistance={15} 
      enabled={!isAnyCardAnimating}
    />
    <Stats />
  </Canvas>
  );
};

export default App;
