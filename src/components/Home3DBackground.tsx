"use client";

import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { useScroll } from "framer-motion";
import { useTheme } from "next-themes";

function RobotModel() {
    const { scene } = useGLTF("/agv.glb");
    
    useMemo(() => {
        scene.traverse((child: any) => {
            if (child.isMesh && child.material) {
                child.material.metalness = 0.8;
                child.material.roughness = 0.15;
                if (child.material.color) {
                    child.material.color.multiplyScalar(0.6);
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <group>
            <primitive object={scene} scale={10} />
        </group>
    );
}

function GlobalCinematicCamera({ scrollYProgress }: { scrollYProgress: any }) {
    useFrame(({ camera, clock }) => {
        const progress = scrollYProgress.get(); 
        const time = clock.getElapsedTime(); 
        
        // Since the page is much longer now, we split the scroll progress into two phases:
        // 1. Hero Phase (0% to 30% of scroll): The fast 360 showcase
        // 2. Rest Phase (30% to 100% of scroll): Pulling back and parking on the side of the screen
        const heroProgress = Math.min(progress / 0.3, 1);
        const restProgress = Math.max((progress - 0.3) / 0.7, 0);
        
        // --- ANGLE ---
        // Do 1.25 full rotations during Hero, then slowly drift another 0.25 rotation during the rest
        const angle = (heroProgress * Math.PI * 2.5) + (restProgress * Math.PI * 0.5);
        
        // --- HEIGHT ---
        // Swoop down and up during Hero (4 -> 1 -> 4), then descend slowly during the rest
        const height = (4 - Math.sin(heroProgress * Math.PI) * 3) - (restProgress * 2);

        // --- RADIUS ---
        // Pull back and in during Hero (9 -> 12 -> 9), then push way back to 16 during the rest
        const radius = (9 + Math.sin(heroProgress * Math.PI) * 3) + (restProgress * 7);

        // --- OFFSET (To push robot to the side) ---
        // We shift the camera to the left so the robot appears on the right side of the screen
        // This prevents the robot from blocking the text in the Features/About sections!
        const offsetX = restProgress * 8; 

        // Drifting effect
        const driftX = Math.sin(time * 0.5) * 0.5;
        const driftY = Math.cos(time * 0.4) * 0.3;

        // Apply transforms
        camera.position.x = Math.sin(angle) * radius + driftX - offsetX;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = height + driftY;
        
        const rollAngle = Math.sin(heroProgress * Math.PI) * 0.25;
        camera.up.set(Math.sin(rollAngle), Math.cos(rollAngle), 0);
        
        camera.lookAt(-offsetX, 1 + Math.sin(time * 0.3) * 0.1, 0);
    });
    return null;
}

export default function Home3DBackground() {
    const { scrollYProgress } = useScroll();
    const { theme } = useTheme();

    return (
        // The fixed background spans the entire screen, sits IN FRONT of the text (z-10)
        // We use pointer-events-none so the user can still click text and buttons behind the robot!
        // It MUST be transparent so you can actually see the text underneath it!
        <div className="fixed inset-0 w-full h-full pointer-events-none z-10 bg-transparent">
            <Canvas>
                <GlobalCinematicCamera scrollYProgress={scrollYProgress} />
                <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />

                {/* --- DRAMATIC AUTOMOTIVE STUDIO LIGHTING --- */}
                <ambientLight intensity={theme === "light" ? 0.3 : 0.1} /> 
                
                <directionalLight position={[10, 10, 5]} intensity={4} color="#ffffff" castShadow />
                <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#93c5fd" />
                <directionalLight position={[0, 2, -15]} intensity={5} color="#ffffff" />

                <Environment preset="studio" />

                <Suspense fallback={null}>
                    <RobotModel />
                </Suspense>

                {/* Ground shadow plane */}
                <ContactShadows resolution={1024} scale={30} blur={3} opacity={0.8} far={10} color="#000000" />
            </Canvas>
        </div>
    );
}
