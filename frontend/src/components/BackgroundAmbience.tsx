import React from 'react';

/**
 * Ambient background decoration — subtle warm gradients, particles, and a faint grid.
 * Purely decorative; sits behind all content.
 */
export const BackgroundAmbience: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {/* Deep warm radial glow — top center */}
    <div
      className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[180px] opacity-[0.07]"
      style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 70%)' }}
    />

    {/* Secondary glow — bottom left */}
    <div
      className="absolute bottom-[-10%] left-[5%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04]"
      style={{ background: 'radial-gradient(circle, #D4B86A 0%, transparent 65%)' }}
    />

    {/* Tertiary glow — right */}
    <div
      className="absolute top-[50%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.03]"
      style={{ background: 'radial-gradient(circle, #9A7B2E 0%, transparent 65%)' }}
    />

    {/* Subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }}
    />

    {/* Top vignette */}
    <div
      className="absolute top-0 left-0 right-0 h-48"
      style={{ background: 'linear-gradient(to bottom, rgba(13,11,8,0.8), transparent)' }}
    />

    {/* Bottom vignette */}
    <div
      className="absolute bottom-0 left-0 right-0 h-48"
      style={{ background: 'linear-gradient(to top, rgba(13,11,8,0.8), transparent)' }}
    />

    {/* Floating dust particles */}
    {Array.from({ length: 15 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-float"
        style={{
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          left: `${(i * 7.3 + 5) % 100}%`,
          top: `${(i * 13.7 + 10) % 100}%`,
          backgroundColor: `rgba(201, 168, 76, ${0.08 + (i % 5) * 0.03})`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${4 + (i % 4)}s`,
        }}
      />
    ))}
  </div>
);

export default BackgroundAmbience;
