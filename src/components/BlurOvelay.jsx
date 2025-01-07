import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 0.5);
  }
`;

const BlurOverlay = () => {
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
    <mesh ref={meshRef} renderOrder={1}>
      <planeGeometry args={[8, 8]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthTest={true}
      />
    </mesh>
  );
};

export default BlurOverlay;