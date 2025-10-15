import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

const AnimatedBackground = ({ theme = 'default' }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Particle system for neural network/circuit board effect
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Color changes based on theme
        const colors = {
          default: `rgba(15, 213, 206, ${this.opacity})`, // Cyan
          problem: `rgba(255, 99, 71, ${this.opacity})`, // Red tint
          solution: `rgba(60, 179, 113, ${this.opacity})`, // Green tint
          acceleration: `rgba(138, 43, 226, ${this.opacity})` // Purple tint
        };

        ctx.fillStyle = colors[theme] || colors.default;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Wave effect for data pulse
    let waveOffset = 0;

    const drawWaves = () => {
      const waveColors = {
        default: ['rgba(15, 213, 206, 0.03)', 'rgba(0, 150, 255, 0.02)'],
        problem: ['rgba(255, 99, 71, 0.03)', 'rgba(255, 140, 0, 0.02)'],
        solution: ['rgba(60, 179, 113, 0.03)', 'rgba(34, 139, 34, 0.02)'],
        acceleration: ['rgba(138, 43, 226, 0.03)', 'rgba(75, 0, 130, 0.02)']
      };

      const colors = waveColors[theme] || waveColors.default;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height / 2 +
                    Math.sin((x + waveOffset) * 0.01 + i * 0.5) * 50 +
                    Math.sin((x + waveOffset) * 0.005 + i) * 30;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
      }

      waveOffset += 0.5;
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      const connectionColors = {
        default: 'rgba(15, 213, 206, 0.1)',
        problem: 'rgba(255, 99, 71, 0.1)',
        solution: 'rgba(60, 179, 113, 0.1)',
        acceleration: 'rgba(138, 43, 226, 0.1)'
      };

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = connectionColors[theme] || connectionColors.default;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 25, 47, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawWaves();
      drawConnections();

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, theme]);

  return (
    <div className="animated-background">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="gradient-overlay" data-theme={theme} />
    </div>
  );
};

export default AnimatedBackground;
