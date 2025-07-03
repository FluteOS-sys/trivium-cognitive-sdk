import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Atom, Columns, Download, Sparkles } from "lucide-react";
import { useState } from "react";

interface SynthesisPanelProps {
  synthesisBlend: number;
  onBlendChange: (blend: number) => void;
  onSynthesize: () => void;
  synthesisOutput?: string;
  isLoading?: boolean;
}

export function SynthesisPanel({ 
  synthesisBlend, 
  onBlendChange, 
  onSynthesize, 
  synthesisOutput,
  isLoading = false
}: SynthesisPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const newBlend = Math.max(0, Math.min(1, x / width));
    onBlendChange(newBlend);
  };

  const handleSliderDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleSliderClick(event);
  };

  return (
    <Card className="cosmic-card rounded-2xl">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--cosmic-gold)" }}>
          <Atom className="inline mr-2" size={24} />
          Synthesis Engine
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span style={{ color: "var(--cosmic-600)" }}>Blend Perspectives</span>
              <span className="text-sm" style={{ color: "var(--cosmic-blue)" }}>
                Harmonic Integration ({Math.round(synthesisBlend * 100)}%)
              </span>
            </div>
            <div 
              className="synthesis-slider"
              onClick={handleSliderClick}
              onMouseDown={() => setIsDragging(true)}
              onMouseMove={handleSliderDrag}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-l-md transition-all duration-300"
                style={{ width: `${synthesisBlend * 100}%` }}
              />
            </div>
          </div>
          
          {synthesisOutput && (
            <>
              <Card className="cosmic-card rounded-xl mb-6" style={{
                background: "linear-gradient(135deg, var(--cosmic-900) 0%, var(--cosmic-800) 100%)"
              }}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">🌟</div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--cosmic-gold)" }}>
                      Synthesized Insight
                    </h3>
                  </div>
                  <Separator className="mb-4" />
                  <div className="text-white leading-relaxed">
                    {synthesisOutput}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onSynthesize}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={{ 
                boxShadow: "0 0 15px rgba(0, 212, 255, 0.3)",
              }}
            >
              <Sparkles className="mr-2" size={16} />
              {isLoading ? "Synthesizing..." : "Synthesize"}
            </Button>
            <Button 
              variant="outline"
              className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <Columns className="mr-2" size={16} />
              Compare Side-by-Side
            </Button>
            <Button 
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <Download className="mr-2" size={16} />
              Export Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
