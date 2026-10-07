import * as React from "react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

interface ParticleButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  particleColor?: string;
  particleCount?: number;
}

export const ParticleButton = React.forwardRef<
  HTMLButtonElement,
  ParticleButtonProps
>(({ className, particleColor = "hsl(var(--primary))", particleCount = 20, onClick, children, ...props }, ref) => {  interface Particle {
    x: number;
    y: number;
    angle: number;
    speed: number;
    alpha: number;
    buttonWidth: number;
    buttonHeight: number;
  }

  const [particles, setParticles] = React.useState<Array<Particle>>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const buttonWidth = event.currentTarget.offsetWidth;
    const buttonHeight = event.currentTarget.offsetHeight;

    const newParticles = Array.from({ length: particleCount }).map(() => ({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 3 + 2,
      alpha: 1,
      buttonWidth,
      buttonHeight
    }));

    setParticles(newParticles);

    // Call the original onClick handler if provided
    onClick?.(event);
  };

  React.useEffect(() => {
    if (particles.length > 0) {
      const animationFrame = requestAnimationFrame(() => {
        setParticles(particles.map(particle => ({
          ...particle,
          x: particle.x + Math.cos(particle.angle) * particle.speed,
          y: particle.y + Math.sin(particle.angle) * particle.speed,
          alpha: particle.alpha - 0.02,
        })).filter(particle => particle.alpha > 0));
      });

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [particles]);

  return (    <div className="relative inline-block">
      <Button
        ref={ref}
        className={cn(className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>      {particles.length > 0 && (
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ minWidth: "200px", minHeight: "200px" }}
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid meet"
        >
          {particles.map((particle, i) => (
            <circle
              key={i}
              cx={particle.x * (200 / particle.buttonWidth)}
              cy={particle.y * (200 / particle.buttonHeight)}
              r={3}
              fill={particleColor}
              opacity={particle.alpha}
            >
              <animate
                attributeName="opacity"
                from={particle.alpha}
                to="0"
                dur="1s"
                begin="0s"
                fill="freeze"
              />
            </circle>
          ))}
        </svg>
      )}
    </div>
  );
});

ParticleButton.displayName = "ParticleButton";
