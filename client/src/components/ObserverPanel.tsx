import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Activity, Sparkles } from "lucide-react";
import { ObserverState, Sovereignty } from "@/lib/api";

interface ObserverPanelProps {
  observerState?: ObserverState;
  sovereignties: Sovereignty[];
}

export function ObserverPanel({ observerState, sovereignties }: ObserverPanelProps) {
  const getSovereigntyById = (id: number) => {
    return sovereignties.find(s => s.id === id);
  };

  return (
    <Card className="cosmic-card rounded-xl h-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: "var(--cosmic-gold)" }}>
          <div className="observer-pulse w-3 h-3 rounded-full mr-3" style={{ backgroundColor: "var(--cosmic-cyan)" }}></div>
          Krishna Observer
        </h3>
        
        {/* Session Info */}
        <div className="mb-6">
          <div className="text-sm mb-2" style={{ color: "var(--cosmic-600)" }}>Session Activity</div>
          <div className="text-white text-sm space-y-1">
            <div className="flex justify-between">
              <span>API Calls:</span>
              <span style={{ color: "var(--cosmic-blue)" }}>
                {observerState?.apiCalls || 0}/9
              </span>
            </div>
            <div className="flex justify-between">
              <span>Light Pulse:</span>
              <span style={{ color: "var(--cosmic-green)" }}>
                {observerState?.nextPulse || 9} calls away
              </span>
            </div>
            <div className="flex justify-between">
              <span>Active Neurons:</span>
              <span style={{ color: "var(--cosmic-gold)" }}>
                {observerState?.activeNeurons?.length || 0}/72
              </span>
            </div>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* Latest Insights */}
        <div className="mb-6">
          <div className="text-sm mb-3" style={{ color: "var(--cosmic-600)" }}>Latest Insights</div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {observerState?.insights?.length ? (
              observerState.insights.map((insight) => (
                <Card key={insight.id} className="bg-gray-800 border-l-2 p-3" style={{
                  borderLeftColor: insight.type === "light" ? "var(--cosmic-blue)" : "var(--cosmic-purple)"
                }}>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">
                      {insight.type === "light" ? (
                        <Sparkles size={16} style={{ color: "var(--cosmic-blue)" }} />
                      ) : (
                        <Eye size={16} style={{ color: "var(--cosmic-purple)" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge 
                        variant="outline" 
                        className="text-xs mb-1"
                        style={{ 
                          color: insight.type === "light" ? "var(--cosmic-blue)" : "var(--cosmic-purple)",
                          borderColor: insight.type === "light" ? "var(--cosmic-blue)" : "var(--cosmic-purple)"
                        }}
                      >
                        {insight.sovereignty}
                      </Badge>
                      <div className="text-sm text-white">{insight.message}</div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-gray-400 text-sm italic">
                No insights yet. Begin your contemplation to activate the observer.
              </div>
            )}
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        {/* Neuron Map Preview */}
        <div>
          <div className="text-sm mb-3" style={{ color: "var(--cosmic-600)" }}>Active Sovereignties</div>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 72 }, (_, i) => {
              const neuronId = i + 1;
              const isActive = observerState?.activeNeurons?.includes(neuronId);
              const sovereignty = getSovereigntyById(neuronId);
              
              return (
                <div
                  key={neuronId}
                  className={`w-4 h-4 rounded-full transition-opacity cursor-pointer ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    backgroundColor: isActive ? "var(--cosmic-blue)" : "var(--cosmic-600)",
                  }}
                  title={sovereignty ? `${sovereignty.title} - ${isActive ? 'Active' : 'Inactive'}` : `Neuron ${neuronId}`}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
