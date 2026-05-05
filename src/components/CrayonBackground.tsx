"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";

export default function CrayonBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        const rc = rough.canvas(canvas);
        let animationFrameId: number;

        const colors = ["#FF5722", "#FFC107", "#4CAF50", "#00BCD4", "#E91E63", "#9C27B0", "#FFEB3B", "#03A9F4", "#8BC34A"];

        let lastDrawTime = 0;

        const draw = (time: number) => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Slowly fade the canvas to create a trailing effect
            ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw a new random shape every ~600ms
            if (time - lastDrawTime > 600) {
                lastDrawTime = time;
                const type = Math.floor(Math.random() * 3);
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 150 + 50;
                const color = colors[Math.floor(Math.random() * colors.length)];

                ctx.save();
                if (type === 0) {
                    rc.circle(x, y, size, { stroke: color, strokeWidth: 3 + Math.random() * 3, roughness: 3 });
                } else if (type === 1) {
                    rc.rectangle(x, y, size, size, { stroke: color, strokeWidth: 3 + Math.random() * 3, roughness: 3 });
                } else {
                    rc.line(x, y, x + size, y + size, { stroke: color, strokeWidth: 5, roughness: 4 });
                }
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        const handleMouseMove = (e: MouseEvent) => {
            // Draw small scribbles when moving mouse rapidly
            if (Math.random() < 0.1) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                rc.circle(e.clientX, e.clientY, Math.random() * 30 + 10, {
                    stroke: color,
                    strokeWidth: 2,
                    roughness: 2
                });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{ backgroundColor: "#0f172a" }} // Slate 900 base so text pops
        />
    );
}
