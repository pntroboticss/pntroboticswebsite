
'use client'

import { Html } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export const Computer = () => {
    return (
        <group position={[0, -0.5, 0]}>
            {/* --- Monitor Stand --- */}
            {/* Base */}
            <mesh position={[0, -1.8, 0]} castShadow>
                <boxGeometry args={[2, 0.1, 1.5]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Vertical Stand */}
            <mesh position={[0, -0.9, -0.5]} castShadow>
                <boxGeometry args={[0.3, 2, 0.3]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* --- Monitor Head --- */}
            <group position={[0, 0.5, 0]}>
                {/* Bezel (Frame) */}
                <mesh position={[0, 0, -0.1]}>
                    <boxGeometry args={[5.2, 3.2, 0.2]} />
                    <meshStandardMaterial color="#0f172a" />
                </mesh>

                {/* Screen Area (Behind the HTML) */}
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[5, 3]} />
                    <meshStandardMaterial color="black" />
                </mesh>

                {/* --- Interactive HTML Screen --- */}
                <Html
                    transform
                    wrapperClass="htmlScreen"
                    distanceFactor={1.5}
                    position={[0, 0, 0.01]}
                    occlude
                >
                    <div className="w-[800px] h-[480px] bg-black rounded-lg overflow-hidden border-none select-none">
                        {/* Embed a simple game or website here */}
                        <iframe
                            src="https://funhtml5games.com/?embed=pacman"
                            className="w-full h-full border-none"
                            title="Retro Game"
                        />
                    </div>
                </Html>
            </group>
        </group>
    )
}
