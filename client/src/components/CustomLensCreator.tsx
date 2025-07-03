import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Eye, Plus, Trash2, Lightbulb, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface CustomLens {
  id: string;
  name: string;
  description: string;
  prompt: string;
  perspective: string;
  archetypalCore: string;
  created: string;
  author?: string;
}

interface ArchetypalBase {
  id: string;
  name: string;
  description: string;
  archetypalCore: string;
  examples: string[];
}

interface LensSuggestion {
  name: string;
  description: string;
  archetypalCore: string;
  perspective: string;
  rationale: string;
}

export function CustomLensCreator() {
  const [customLenses, setCustomLenses] = useState<CustomLens[]>([]);
  const [archetypalBases, setArchetypalBases] = useState<ArchetypalBase[]>([]);
  const [suggestions, setSuggestions] = useState<LensSuggestion[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    perspective: '',
    archetypalCore: '',
    author: ''
  });

  const loadCustomLenses = async () => {
    try {
      const response = await fetch('/api/v1/custom-lenses');
      const data = await response.json();
      setCustomLenses(data.customLenses || []);
    } catch (error) {
      console.error('Error loading custom lenses:', error);
    }
  };

  const loadArchetypalBases = async () => {
    try {
      const response = await fetch('/api/v1/custom-lenses/archetypal-bases');
      const data = await response.json();
      setArchetypalBases(data.archetypalBases || []);
    } catch (error) {
      console.error('Error loading archetypal bases:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/v1/custom-lenses/suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const createCustomLens = async () => {
    if (!formData.name || !formData.description || !formData.prompt || !formData.perspective || !formData.archetypalCore) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/custom-lenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create lens');
      }

      const data = await response.json();
      
      toast({
        title: "Custom Lens Created",
        description: `${data.lens.name} has been created with archetypal alignment: ${data.archetypalAlignment}`,
      });

      setFormData({
        name: '',
        description: '',
        prompt: '',
        perspective: '',
        archetypalCore: '',
        author: ''
      });
      
      await loadCustomLenses();
      setShowCreator(false);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create custom lens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomLens = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/custom-lenses/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadCustomLenses();
        toast({
          title: "Lens Deleted",
          description: "Custom lens has been removed",
        });
      }
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete custom lens",
        variant: "destructive"
      });
    }
  };

  const applySuggestion = (suggestion: LensSuggestion) => {
    setFormData({
      ...formData,
      name: suggestion.name,
      description: suggestion.description,
      archetypalCore: suggestion.archetypalCore,
      perspective: suggestion.perspective,
      prompt: `Analyze the following text from the perspective of ${suggestion.perspective}. 

Focus on ${suggestion.archetypalCore} and provide insights that reveal how this archetypal principle manifests in the content.

Consider both the constructive and shadow aspects of this lens, and ground your analysis in the deeper patterns that emerge.`
    });
    setShowCreator(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Custom Cognitive Lenses</h2>
          <p className="text-gray-400">Create your own archetypal perspectives for deeper analysis</p>
        </div>
        <Button 
          onClick={() => setShowCreator(!showCreator)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Lens
        </Button>
      </div>

      {/* Load buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={loadCustomLenses}>
          <Eye className="w-4 h-4 mr-2" />
          View My Lenses
        </Button>
        <Button variant="outline" onClick={loadArchetypalBases}>
          View Archetypal Bases
        </Button>
        <Button variant="outline" onClick={loadSuggestions}>
          <Lightbulb className="w-4 h-4 mr-2" />
          Get Suggestions
        </Button>
      </div>

      {/* Lens Creator Form */}
      {showCreator && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create Custom Lens</CardTitle>
            <CardDescription>
              Define a new cognitive perspective grounded in archetypal principles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Lens Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Temporal Lens"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="author">Author (Optional)</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Your name"
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What does this lens focus on? How does it see the world?"
                className="bg-gray-700 border-gray-600"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="archetypalCore">Archetypal Core Principle</Label>
              <Input
                id="archetypalCore"
                value={formData.archetypalCore}
                onChange={(e) => setFormData({...formData, archetypalCore: e.target.value})}
                placeholder="e.g., Time-Eternity Principle, Energy-Conservation Principle"
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="perspective">Perspective Description</Label>
              <Textarea
                id="perspective"
                value={formData.perspective}
                onChange={(e) => setFormData({...formData, perspective: e.target.value})}
                placeholder="How does this lens view reality? What is its fundamental worldview?"
                className="bg-gray-700 border-gray-600"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="prompt">Analysis Prompt</Label>
              <Textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                placeholder="Instructions for how this lens should analyze text..."
                className="bg-gray-700 border-gray-600"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={createCustomLens}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? 'Creating...' : 'Create Lens'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreator(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Suggested Lenses
            </CardTitle>
            <CardDescription>
              These lenses would expand the archetypal coverage of your cognitive framework
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{suggestion.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{suggestion.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {suggestion.archetypalCore}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Rationale:</strong> {suggestion.rationale}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => applySuggestion(suggestion)}
                      className="ml-4"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Custom Lenses */}
      {customLenses.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Custom Lenses</CardTitle>
            <CardDescription>
              Manage your created cognitive perspectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {customLenses.map((lens) => (
                <div key={lens.id} className="border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{lens.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{lens.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {lens.archetypalCore}
                      </Badge>
                      {lens.author && (
                        <p className="text-xs text-gray-500 mt-2">
                          Created by {lens.author}
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteCustomLens(lens.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Archetypal Bases */}
      {archetypalBases.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Archetypal Foundation</CardTitle>
            <CardDescription>
              Core archetypal patterns you can build upon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {archetypalBases.map((base) => (
                <div key={base.id} className="border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white">{base.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{base.description}</p>
                  <Badge variant="outline" className="mt-2">
                    {base.archetypalCore}
                  </Badge>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Examples:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {base.examples.map((example, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}