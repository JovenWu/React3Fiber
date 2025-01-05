import React from "react";
import { Canvas } from "@react-three/fiber";
import Wall from "./components/Wall";
import Card from "./components/Card";
import { OrbitControls, useGLTF, Stats } from "@react-three/drei";
import "./styles.css";

const App = () => {
  const cardPositions = [
    { x: 1.2, y: 1.145, z: 3 },
    { x: 1.9, y: 1.145, z: 2 },
    { x: -2, y: 1.4, z: 1 },
    { x: 2, y: 0.5, z: -2 },
    { x: 3, y: 0.5, z: 1 },
    { x: 4, y: 0.5, z: 3 },
  ];
  const { scene } = useGLTF("/room.glb");

  return (
    <Canvas camera={{ fov: 75, position: [7, 7, 7] }}>
      <directionalLight position={[-2, 15, -2]} intensity={1} />
      <directionalLight castShadow position={[5, 5, 5]} intensity={1} />
      <Wall size={[10, 10, 1]} position={[0, 5.5, -7]} />
      <Wall size={[1, 10, 15]} position={[-4.5, 5.5, 0]} />
      <mesh>
        <boxGeometry args={[10, 1, 15]} />
        <meshLambertMaterial color={0xfffaec} />
      </mesh>
      {cardPositions.map((position, index) => (
        <Card key={index} position={position} />
      ))}
      <primitive object={scene} position={[2, 0.91, 2]} scale={2} />
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.008} minDistance={10} maxDistance={15} />
      <Stats />
    </Canvas>
  );
};

export default App;
