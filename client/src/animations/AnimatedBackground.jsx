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

        // Themes shift along the greyscale ramp rather than by hue,
        // so sections still read as distinct without colour.
        const intensity = {
          default: 0.55,
          problem: 0.3,
          solution: 0.7,
          acceleration: 0.85
        };

        const alpha = this.opacity * (intensity[theme] ?? intensity.default);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    }

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    // Wave effect for data pulse
    let waveOffset = 0;

    const drawWaves = () => {
      /* Three wave bands are filled per frame and the canvas is only
         partially cleared, so these alphas accumulate toward
         sum/(sum + clearAlpha). Keep them low: white on black builds up
         far faster than the old cyan-on-navy did, and a heavy band
         behind body copy destroys the contrast the design depends on. */
      const waveColors = {
        default: ['rgba(255, 255, 255, 0.005)', 'rgba(255, 255, 255, 0.003)'],
        problem: ['rgba(255, 255, 255, 0.003)', 'rgba(255, 255, 255, 0.002)'],
        solution: ['rgba(255, 255, 255, 0.007)', 'rgba(255, 255, 255, 0.004)'],
        acceleration: ['rgba(255, 255, 255, 0.009)', 'rgba(255, 255, 255, 0.005)']
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
        default: 'rgba(255, 255, 255, 0.085)',
        problem: 'rgba(255, 255, 255, 0.045)',
        solution: 'rgba(255, 255, 255, 0.110)',
        acceleration: 'rgba(255, 255, 255, 0.135)'
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
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
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
