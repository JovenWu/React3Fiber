import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BlurOverlay = ({ isVisible }) => {
  const { camera } = useThree();
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;

    // Position the overlay slightly in front of the camera
    const distance = 2;
    const vector = new THREE.Vector3(0, 0, -distance);
    vector.applyQuaternion(camera.quaternion);
    meshRef.current.position.copy(camera.position).add(vector);
    
    // Make the overlay face the camera
    meshRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <mesh
      ref={meshRef}
      visible={isVisible}
      renderOrder={1} // Ensure it renders last
    >
      <planeGeometry args={[8, 8]} /> {/* Adjust size as needed */}
      <meshBasicMaterial
        transparent
        opacity={0.3}
        color="#000000"
        side={THREE.DoubleSide}
        depthTest={true}
      />
    </mesh>
  );
};

export default BlurOverlay;