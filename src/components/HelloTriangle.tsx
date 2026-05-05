'use client'

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 1. Vertex Shader: "Where is this point?"
// This runs for every vertex (corner) of the triangle.
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Calculate the position of the vertex on the screen
    // projectionMatrix * modelViewMatrix transforms 3D space to 2D screen space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// 2. Fragment Shader: "What color is this pixel?"
// This runs for every single pixel inside the triangle.
const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    gl_FragColor = vec4(vUv.x, vUv.y, 0.5 + 0.5 * sin(uTime), 1.0);
  }
`

export function HelloTriangle() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Uniforms to update values in shaders
  const uniforms = useRef({
    uTime: { value: 0 }
  })

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.x += delta * 0.2
      // Update uniform
      if (uniforms.current) {
          uniforms.current.uTime.value = state.clock.elapsedTime
      }
    }
  })

  return (
    <mesh ref={meshRef} >
      <tetrahedronGeometry args={[1, 0]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}
