import { useEffect, useState } from "react";

const glyphs = ["✦", "◈", "✧", "◊", "⟡", "◎", "✨", "◆", "✤", "◉"];

interface Glyph {
  id: number;
  symbol: string;
  x: number;
  y: number;
  delay: number;
}

export function AnimatedBackground() {
  const [backgroundGlyphs, setBackgroundGlyphs] = useState<Glyph[]>([]);

  useEffect(() => {
    const generateGlyphs = () => {
      const newGlyphs: Glyph[] = [];
      for (let i = 0; i < 12; i++) {
        newGlyphs.push({
          id: i,
          symbol: glyphs[Math.floor(Math.random() * glyphs.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 6,
        });
      }
      setBackgroundGlyphs(newGlyphs);
    };

    generateGlyphs();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {backgroundGlyphs.map((glyph) => (
        <div
          key={glyph.id}
          className="glyph-bg absolute text-2xl opacity-20"
          style={{
            left: `${glyph.x}%`,
            top: `${glyph.y}%`,
            animationDelay: `${glyph.delay}s`,
            color: "var(--cosmic-blue)",
          }}
        >
          {glyph.symbol}
        </div>
      ))}
    </div>
  );
}
