'use client'
import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { Computer } from '@/components/Computer'
import { HelloTriangle } from '@/components/HelloTriangle'

export const Experience = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div className="mobile-safe-canvas" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Canvas
                camera={{ position: [0, 2, 8], fov: 45 }}
                shadows
                dpr={isMobile ? [1, 1.5] : [1, 2]}
            >
                <color attach="background" args={['#1e1b4b']} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    <HelloTriangle />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                </Suspense>

                {!isMobile && (
                    <OrbitControls
                        enableZoom={true}
                        minDistance={5}
                        maxDistance={15}
                        minPolarAngle={Math.PI / 2.5}
                        maxPolarAngle={Math.PI / 2}
                    />
                )}
            </Canvas>
        </div>
    )
}
