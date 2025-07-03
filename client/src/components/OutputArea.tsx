import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Rainbow } from "lucide-react";

interface OutputAreaProps {
  outputs: Record<string, string>;
  selectedLenses: string[];
}

const lensConfig = {
  ethical: {
    emoji: "⚖️",
    title: "Ethical Perspective",
    description: "Moral implications and values assessment",
    color: "var(--cosmic-gold)",
  },
  emotional: {
    emoji: "❤️",
    title: "Emotional Perspective",
    description: "Emotional intelligence and empathy lens",
    color: "var(--cosmic-green)",
  },
  logical: {
    emoji: "🧠",
    title: "Logical Perspective",
    description: "Rational analysis and systematic thinking",
    color: "var(--cosmic-blue)",
  },
  symbolic: {
    emoji: "🔮",
    title: "Symbolic Perspective",
    description: "Patterns, archetypes, and deeper meaning",
    color: "var(--cosmic-purple)",
  },
};

export function OutputArea({ outputs, selectedLenses }: OutputAreaProps) {
  const hasOutputs = Object.keys(outputs).length > 0;

  if (!hasOutputs) {
    return (
      <Card className="cosmic-card rounded-xl">
        <CardContent className="p-8 text-center">
          <Rainbow className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--cosmic-gold)" }}>
            Multi-Lens Analysis
          </h2>
          <p className="text-gray-400">
            Enter your contemplation and select lenses to begin the analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--cosmic-gold)" }}>
        <Rainbow className="inline mr-2" size={24} />
        Multi-Lens Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedLenses.map((lensKey) => {
          const config = lensConfig[lensKey as keyof typeof lensConfig];
          const output = outputs[lensKey];
          
          if (!config) return null;
          
          return (
            <Card
              key={lensKey}
              className="cosmic-card rounded-xl hover:shadow-glow transition-all duration-300"
              style={{
                borderColor: output ? config.color : "hsla(195, 100%, 50%, 0.2)",
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{config.emoji}</div>
                  <h3 className="text-lg font-semibold" style={{ color: config.color }}>
                    {config.title}
                  </h3>
                </div>
                <div className="text-sm mb-3" style={{ color: "var(--cosmic-600)" }}>
                  {config.description}
                </div>
                <Separator className="mb-4" />
                <div className="text-white leading-relaxed">
                  {output || (
                    <div className="text-gray-400 italic">
                      Processing through {config.title.toLowerCase()}...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
