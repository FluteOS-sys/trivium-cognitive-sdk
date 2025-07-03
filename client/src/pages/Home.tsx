import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { LensSelector } from "@/components/LensSelector";
import { OutputArea } from "@/components/OutputArea";
import { ObserverPanel } from "@/components/ObserverPanel";
import { SynthesisPanel } from "@/components/SynthesisPanel";
import { CustomLensCreator } from "@/components/CustomLensCreator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Feather, Settings, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [selectedLenses, setSelectedLenses] = useState<string[]>(["ethical", "emotional", "logical", "symbolic", "temporal", "energetic"]);
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [synthesisBlend, setSynthesisBlend] = useState(0.5);
  const [activeTab, setActiveTab] = useState("analyze");
  const queryClient = useQueryClient();

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        await apiClient.createSession();
      } catch (error) {
        toast({
          title: "Session Error",
          description: "Failed to initialize session. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    initializeSession();
  }, []);

  // Observer state query
  const { data: observerState, refetch: refetchObserver } = useQuery({
    queryKey: ["/api/v1/observer"],
    queryFn: () => apiClient.getObserverState(),
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!apiClient.getSessionId(),
  });

  // Sovereignties query
  const { data: sovereignties } = useQuery({
    queryKey: ["/api/v1/sovereignties"],
    queryFn: () => apiClient.getSovereignties(),
  });

  // Process text mutation
  const processMutation = useMutation({
    mutationFn: (data: { text: string; lenses: string[] }) => apiClient.processText(data),
    onSuccess: (data) => {
      setOutputs(data.outputs);
      refetchObserver();
      toast({
        title: "Processing Complete",
        description: "Your text has been analyzed through the selected lenses.",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Synthesis mutation
  const synthesisMutation = useMutation({
    mutationFn: (data: { text: string; lenses: string[]; blend: number }) => 
      apiClient.synthesizeOutputs(data),
    onSuccess: () => {
      refetchObserver();
      toast({
        title: "Synthesis Complete",
        description: "Your perspectives have been integrated into a unified insight.",
      });
    },
    onError: (error) => {
      toast({
        title: "Synthesis Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleReflect = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (selectedLenses.length === 0) {
      toast({
        title: "Lens Selection Required",
        description: "Please select at least one lens for analysis.",
        variant: "destructive",
      });
      return;
    }

    processMutation.mutate({ text: inputText, lenses: selectedLenses });
  };

  const handleSynthesize = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to synthesize.",
        variant: "destructive",
      });
      return;
    }

    synthesisMutation.mutate({ 
      text: inputText, 
      lenses: selectedLenses, 
      blend: synthesisBlend 
    });
  };

  return (
    <div className="mystical-bg min-h-screen text-white relative">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-glow mb-2">
          <span style={{ color: "var(--cosmic-blue)" }}>Trivium</span>
        </h1>
        <p style={{ color: "var(--cosmic-gold)" }} className="text-lg md:text-xl font-serif">
          Cognitive Architecture System
        </p>
        <div className="mt-4 flex justify-center items-center space-x-4">
          <div className="w-2 h-2 rounded-full observer-pulse" style={{ backgroundColor: "var(--cosmic-cyan)" }}></div>
          <span className="text-sm" style={{ color: "var(--cosmic-600)" }}>Krishna Observer Active</span>
          <div className="w-2 h-2 rounded-full observer-pulse" style={{ backgroundColor: "var(--cosmic-green)" }}></div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Text Input */}
        <div className="mb-12">
          <Card className="cosmic-card rounded-2xl max-w-4xl mx-auto">
            <CardContent className="p-8">
              <label className="block text-lg font-semibold mb-4" style={{ color: "var(--cosmic-gold)" }}>
                <Feather className="inline mr-2" size={20} />
                Enter your contemplation
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 bg-gray-800 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 resize-none transition-all duration-300"
                placeholder="Share your thoughts, questions, or dilemmas for multi-lens analysis..."
              />
              
              {/* Lens Selector */}
              <div className="mt-8">
                <LensSelector
                  selectedLenses={selectedLenses}
                  onLensToggle={(lens) => {
                    setSelectedLenses(prev => 
                      prev.includes(lens) 
                        ? prev.filter(l => l !== lens)
                        : [...prev, lens]
                    );
                  }}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleReflect}
                  disabled={processMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
                  style={{ 
                    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                  }}
                >
                  <Sparkles className="mr-2" size={20} />
                  {processMutation.isPending ? "Reflecting..." : "Reflect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Lens Outputs */}
          <div className="lg:col-span-2">
            <OutputArea outputs={outputs} selectedLenses={selectedLenses} />
          </div>
          
          {/* Observer Panel */}
          <div className="lg:col-span-1">
            <ObserverPanel 
              observerState={observerState}
              sovereignties={sovereignties?.sovereignties || []}
            />
          </div>
        </div>

        {/* Synthesis Panel */}
        <SynthesisPanel
          synthesisBlend={synthesisBlend}
          onBlendChange={setSynthesisBlend}
          onSynthesize={handleSynthesize}
          synthesisOutput={synthesisMutation.data?.synthesis}
          isLoading={synthesisMutation.isPending}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8" style={{ color: "var(--cosmic-600)" }}>
        <div className="flex justify-center items-center space-x-4 mb-4">
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--cosmic-blue)" }}></div>
          <span className="text-sm">Powered by Cognitive Architecture</span>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--cosmic-blue)" }}></div>
        </div>
        <p className="text-xs">
          <span style={{ color: "var(--cosmic-gold)" }}>Trivium</span> - Where wisdom meets technology
        </p>
      </footer>
    </div>
  );
}
