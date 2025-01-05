import React, { useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const CARD_COLOR = 0xeb4034;

let isAnyCardAnimating = false;

const Card = ({ position }) => {
  const meshRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const { camera, controls } = useThree();

  const originalPosition = new THREE.Vector3(
    position.x,
    position.y,
    position.z
  );
  const originalRotation = new THREE.Euler(0, 0, 0);

  const cardFrontTexture = useLoader(TextureLoader, '/cardFrontTexture.jpg');
  const cardBackTexture = useLoader(TextureLoader, '/cardBackTexture.png');

  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: CARD_COLOR }),
    new THREE.MeshStandardMaterial({ color: CARD_COLOR }),
    new THREE.MeshStandardMaterial({ map: cardBackTexture }),
    new THREE.MeshStandardMaterial({ map: cardFrontTexture }),
    new THREE.MeshStandardMaterial({ color: CARD_COLOR }),
    new THREE.MeshStandardMaterial({ color: CARD_COLOR }),
  ], [cardFrontTexture, cardBackTexture]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Update controls enabled state
    if (controls) {
      controls.enabled = !isAnyCardAnimating;
    }

    if (isAnimating) {
        
      // Calculate position in front of camera
      const targetPosition = new THREE.Vector3(0, 0, -0.8);
      targetPosition.applyMatrix4(camera.matrixWorld);

      // Update position and rotation
      meshRef.current.position.lerp(targetPosition, 0.03);

      // Updated rotation logic
      const quaternion = new THREE.Quaternion();
      camera.getWorldQuaternion(quaternion);
      const adjustment = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI / 2, Math.PI, Math.PI)
      );
      quaternion.multiply(adjustment);
      meshRef.current.quaternion.slerp(quaternion, 0.03);
      if (!hasBeenClicked) setHasBeenClicked(true);
    } else {
      meshRef.current.position.lerp(originalPosition, 0.03);
      const targetRotation = new THREE.Quaternion().setFromEuler(
        hasBeenClicked ? new THREE.Euler(0, 0, Math.PI) : originalRotation
      );
      meshRef.current.quaternion.slerp(targetRotation, 0.03);
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    
    // Prevent clicking if another card is animating
    if (isAnyCardAnimating && !isAnimating) {
      return;
    }

    // Update animation states
    setIsAnimating(!isAnimating);
    isAnyCardAnimating = !isAnyCardAnimating;
  };

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
      position={[position.x, position.y, position.z]}
    >
      <boxGeometry args={[0.5, 0.02, 0.7]} />
      {materials.map((material, index) => (
        <primitive key={index} object={material} attach={`material-${index}`} />
      ))}
    </mesh>
  );
};

export default Card;
