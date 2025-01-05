import React from 'react'

const Wall = ({position, size}) => {
  return (
    <mesh position={position}>
    <boxGeometry args={size} />
    <meshLambertMaterial color={0xfffaec} />
  </mesh>
  )
}

export default Wall