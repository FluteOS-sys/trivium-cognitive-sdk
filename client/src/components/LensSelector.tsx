import { Card, CardContent } from "@/components/ui/card";

interface LensSelectorProps {
  selectedLenses: string[];
  onLensToggle: (lens: string) => void;
}

const lensConfig = {
  ethical: {
    emoji: "⚖️",
    title: "Ethical",
    description: "Moral & Values",
    color: "var(--cosmic-gold)",
  },
  emotional: {
    emoji: "❤️",
    title: "Emotional",
    description: "Feelings & Empathy",
    color: "var(--cosmic-green)",
  },
  logical: {
    emoji: "🧠",
    title: "Logical",
    description: "Reason & Analysis",
    color: "var(--cosmic-blue)",
  },
  symbolic: {
    emoji: "🔮",
    title: "Symbolic",
    description: "Patterns & Meaning",
    color: "var(--cosmic-purple)",
  },
  temporal: {
    emoji: "⏰",
    title: "Temporal",
    description: "Time & Evolution",
    color: "var(--cosmic-pink)",
  },
  energetic: {
    emoji: "⚡",
    title: "Energetic", 
    description: "Resources & Flow",
    color: "var(--cosmic-yellow)",
  },
  aesthetic: {
    emoji: "✨",
    title: "Aesthetic",
    description: "Beauty & Elegance", 
    color: "var(--cosmic-rose)",
  },
  survival: {
    emoji: "🛡️",
    title: "Survival",
    description: "Security & Resilience",
    color: "var(--cosmic-red)",
  },
  relational: {
    emoji: "🌐",
    title: "Relational",
    description: "Networks & Connections",
    color: "var(--cosmic-cyan)",
  },
  transcendent: {
    emoji: "🌟",
    title: "Transcendent", 
    description: "Purpose & Vision",
    color: "var(--cosmic-white)",
  },
};

export function LensSelector({ selectedLenses, onLensToggle }: LensSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-center" style={{ color: "var(--cosmic-gold)" }}>
        👁️ Select Cognitive Lenses
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(lensConfig).map(([lensKey, config]) => (
          <Card
            key={lensKey}
            className={`lens-orb cosmic-card rounded-xl cursor-pointer text-center transition-all duration-300 hover:scale-105 ${
              selectedLenses.includes(lensKey) ? "active" : ""
            }`}
            onClick={() => onLensToggle(lensKey)}
            style={{
              borderColor: selectedLenses.includes(lensKey) 
                ? config.color 
                : "hsla(195, 100%, 50%, 0.2)",
            }}
          >
            <CardContent className="p-4">
              <div className="text-3xl mb-2">{config.emoji}</div>
              <div className="text-sm font-semibold" style={{ color: config.color }}>
                {config.title}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--cosmic-600)" }}>
                {config.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
