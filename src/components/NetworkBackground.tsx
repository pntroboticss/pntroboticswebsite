"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

class Particle {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    size: number;
    color: string;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.ctx = ctx;
        this.canvas = canvas;
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update() {
        if (this.x > this.canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

export default function NetworkBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme, systemTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        let animationFrameId: number;

        // Detect mobile once — on mobile we skip all mouse tracking
        const isMobile = window.matchMedia("(max-width: 1024px)").matches;

        const mouse = {
            x: -1000,
            y: -1000,
            radius: 180,
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        // Only add mouse listeners on desktop
        if (!isMobile) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseout", handleMouseLeave);
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener("resize", resize);

        const currentTheme = theme === "system" ? systemTheme : theme;
        const isDark = currentTheme === "dark";

        const connect = () => {
            if (!ctx) return;
            let opacityValue = 1;

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const distance =
                        (particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) +
                        (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y);

                    if (distance < (canvas!.width / 15) * (canvas!.height / 15)) {
                        opacityValue = 1 - distance / 20000;
                        if (opacityValue > 0) {
                            ctx.strokeStyle = isDark
                                ? `rgba(100, 116, 139, ${opacityValue * 0.2})`
                                : `rgba(148, 163, 184, ${opacityValue * 0.4})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            // Mouse-proximity lines — desktop only
            if (!isMobile) {
                for (let a = 0; a < particlesArray.length; a++) {
                    const distanceToMouse =
                        (particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x) +
                        (particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y);

                    if (distanceToMouse < mouse.radius * mouse.radius) {
                        opacityValue = 1 - distanceToMouse / (mouse.radius * mouse.radius);
                        ctx.strokeStyle = isDark
                            ? `rgba(56, 189, 248, ${opacityValue})`
                            : `rgba(2, 132, 199, ${opacityValue})`;
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        };

        const init = () => {
            particlesArray = [];
            const numberOfParticles = (canvas!.height * canvas!.width) / 25000;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * (innerWidth - size * 4) + size * 2;
                const y = Math.random() * (innerHeight - size * 4) + size * 2;
                const directionX = (Math.random() * 1.5) - 0.75;
                const directionY = (Math.random() * 1.5) - 0.75;

                const isPurple = Math.random() > 0.5;
                const color = isDark
                    ? isPurple ? "rgba(139, 92, 246, 0.8)" : "rgba(56, 189, 248, 0.8)"
                    : isPurple ? "rgba(124, 58, 237, 0.8)" : "rgba(2, 132, 199, 0.8)";

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, ctx, canvas));
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!ctx) return;
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            ctx.fillStyle = isDark ? "#020617" : "#f8fafc";
            ctx.fillRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        };

        resize();

        // Delay animation start by 1 frame so the browser can paint LCP first
        let started = false;
        const startAnimation = () => {
            if (!started) {
                started = true;
                animate();
            }
        };

        // Start after a brief yield so critical renders aren't blocked
        const rAF = requestAnimationFrame(startAnimation);

        // Pause when tab is hidden — saves CPU during background loads
        const handleVisibilityChange = () => {
            if (document.hidden) {
                cancelAnimationFrame(animationFrameId);
            } else {
                animate();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            cancelAnimationFrame(rAF);
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("resize", resize);
            if (!isMobile) {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseout", handleMouseLeave);
            }
        };
    }, [theme, systemTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500"
            suppressHydrationWarning
        />
    );
}
