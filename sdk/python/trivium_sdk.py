"""
Trivium SDK - Cognitive Lens Framework for Python Development
"""

from enum import Enum
from typing import Dict, List, Optional, NamedTuple
import requests
import json
from dataclasses import dataclass

class LensType(Enum):
    ETHICAL = "ethical"
    EMOTIONAL = "emotional"
    LOGICAL = "logical"
    SYMBOLIC = "symbolic"
    TEMPORAL = "temporal"
    ENERGETIC = "energetic"
    AESTHETIC = "aesthetic"
    SURVIVAL = "survival"
    RELATIONAL = "relational"
    TRANSCENDENT = "transcendent"

@dataclass
class LensPattern:
    name: str
    lenses: List[LensType]
    focus: str
    description: str

@dataclass
class ProcessResult:
    outputs: Dict[LensType, str]
    pattern: Optional[LensPattern] = None
    synthesis_blend: Optional[float] = None
    synthesis: Optional[str] = None

class LensPatterns:
    CODE_REVIEW = LensPattern(
        name="CODE_REVIEW",
        lenses=[LensType.ETHICAL, LensType.LOGICAL],
        focus="Security, efficiency, and maintainability analysis",
        description="Combines ethical considerations (security, privacy) with logical analysis (structure, performance)"
    )
    
    DEBUGGING = LensPattern(
        name="DEBUGGING",
        lenses=[LensType.LOGICAL, LensType.EMOTIONAL],
        focus="Systematic problem-solving with user empathy",
        description="Balances technical analysis with understanding user impact and frustration"
    )
    
    DOCUMENTATION = LensPattern(
        name="DOCUMENTATION",
        lenses=[LensType.SYMBOLIC, LensType.EMOTIONAL],
        focus="Clear communication and user understanding",
        description="Creates intuitive explanations using metaphors and empathetic user perspective"
    )
    
    DATA_ANALYSIS = LensPattern(
        name="DATA_ANALYSIS",
        lenses=[LensType.LOGICAL, LensType.ETHICAL],
        focus="Statistical rigor with ethical data handling",
        description="Combines analytical precision with consideration of data privacy and bias"
    )
    
    ML_VALIDATION = LensPattern(
        name="ML_VALIDATION",
        lenses=[LensType.LOGICAL, LensType.ETHICAL, LensType.EMOTIONAL],
        focus="Model performance, fairness, and user impact",
        description="Comprehensive ML model evaluation including technical metrics and social impact"
    )
    
    PERFORMANCE_OPTIMIZATION = LensPattern(
        name="PERFORMANCE_OPTIMIZATION",
        lenses=[LensType.ENERGETIC, LensType.LOGICAL, LensType.TEMPORAL],
        focus="Resource efficiency and long-term performance",
        description="Analyzes energy consumption, algorithmic efficiency, and performance evolution"
    )
    
    PRODUCT_STRATEGY = LensPattern(
        name="PRODUCT_STRATEGY",
        lenses=[LensType.TRANSCENDENT, LensType.RELATIONAL, LensType.TEMPORAL, LensType.ETHICAL],
        focus="Vision-driven product development with ethical foundations", 
        description="Combines higher purpose, stakeholder relationships, time dynamics, and ethical considerations"
    )
    
    SECURITY_AUDIT = LensPattern(
        name="SECURITY_AUDIT",
        lenses=[LensType.ETHICAL, LensType.SURVIVAL, LensType.LOGICAL],
        focus="Comprehensive security and threat assessment",
        description="Evaluates vulnerabilities, privacy, resilience, and systematic security measures"
    )
    
    UX_DESIGN = LensPattern(
        name="UX_DESIGN",
        lenses=[LensType.EMOTIONAL, LensType.AESTHETIC, LensType.TRANSCENDENT],
        focus="Meaningful user experiences and transformational design",
        description="Combines empathy, beauty, and higher purpose for impactful user interactions"
    )
    
    TECHNICAL_DEBT = LensPattern(
        name="TECHNICAL_DEBT", 
        lenses=[LensType.TEMPORAL, LensType.ENERGETIC, LensType.SURVIVAL, LensType.ETHICAL],
        focus="Long-term code health and sustainability assessment",
        description="Evaluates time impact, resource costs, system robustness, and maintenance ethics"
    )
    
    COMPLETE_ANALYSIS = LensPattern(
        name="COMPLETE_ANALYSIS",
        lenses=[
            LensType.ETHICAL, LensType.EMOTIONAL, LensType.LOGICAL, LensType.SYMBOLIC,
            LensType.TEMPORAL, LensType.ENERGETIC, LensType.AESTHETIC, LensType.SURVIVAL,
            LensType.RELATIONAL, LensType.TRANSCENDENT
        ],
        focus="Full archetypal cognitive analysis using all perspectives",
        description="Comprehensive analysis through all 10 cognitive lenses for complete understanding"
    )

class TriviumCore:
    """Core cognitive lens processing engine for Python"""
    
    def __init__(self, api_url: str = "http://localhost:5000", session_id: Optional[str] = None):
        self.api_url = api_url.rstrip('/')
        self.session_id = session_id
        self._initialize_session()
    
    def _initialize_session(self):
        """Initialize session with Trivium API"""
        if not self.session_id:
            try:
                response = requests.post(f"{self.api_url}/api/v1/session")
                response.raise_for_status()
                self.session_id = response.json()["sessionId"]
            except requests.RequestException:
                # Fallback to local processing if API unavailable
                self.session_id = "local_session"
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        headers = {"Content-Type": "application/json"}
        if self.session_id:
            headers["x-session-id"] = self.session_id
        return headers
    
    def process_text(self, text: str, lenses: List[LensType]) -> ProcessResult:
        """Process text through specified cognitive lenses"""
        try:
            lens_names = [lens.value for lens in lenses]
            response = requests.post(
                f"{self.api_url}/api/v1/process",
                headers=self._get_headers(),
                json={"text": text, "lenses": lens_names}
            )
            response.raise_for_status()
            data = response.json()
            
            # Convert string keys back to LensType enum
            outputs = {}
            for lens_name, output in data["outputs"].items():
                lens_type = LensType(lens_name)
                outputs[lens_type] = output
                
            return ProcessResult(outputs=outputs)
            
        except requests.RequestException:
            # Fallback to local processing
            return self._process_locally(text, lenses)
    
    def process_with_pattern(self, text: str, pattern: LensPattern) -> ProcessResult:
        """Process text using a predefined cognitive pattern"""
        result = self.process_text(text, pattern.lenses)
        result.pattern = pattern
        return result
    
    def process_and_synthesize(self, text: str, lenses: List[LensType], blend: float = 0.5) -> ProcessResult:
        """Process text and synthesize outputs with specified blend"""
        try:
            lens_names = [lens.value for lens in lenses]
            response = requests.post(
                f"{self.api_url}/api/v1/synthesize",
                headers=self._get_headers(),
                json={"text": text, "lenses": lens_names, "blend": blend}
            )
            response.raise_for_status()
            data = response.json()
            
            # Convert outputs
            outputs = {}
            for lens_name, output in data["outputs"].items():
                lens_type = LensType(lens_name)
                outputs[lens_type] = output
                
            return ProcessResult(
                outputs=outputs,
                synthesis=data["synthesis"],
                synthesis_blend=blend
            )
            
        except requests.RequestException:
            # Fallback processing
            result = self._process_locally(text, lenses)
            result.synthesis = self._synthesize_locally(result.outputs, blend)
            result.synthesis_blend = blend
            return result
    
    def get_suggested_pattern(self, context: str) -> LensPattern:
        """Get suggested lens pattern based on context"""
        context_lower = context.lower()
        
        if any(word in context_lower for word in ['review', 'audit', 'security']):
            return LensPatterns.CODE_REVIEW
        elif any(word in context_lower for word in ['debug', 'bug', 'error', 'exception']):
            return LensPatterns.DEBUGGING
        elif any(word in context_lower for word in ['doc', 'readme', 'guide', 'manual']):
            return LensPatterns.DOCUMENTATION
        elif any(word in context_lower for word in ['data', 'dataset', 'analysis', 'statistics']):
            return LensPatterns.DATA_ANALYSIS
        elif any(word in context_lower for word in ['model', 'ml', 'machine learning', 'ai']):
            return LensPatterns.ML_VALIDATION
        else:
            return LensPatterns.CODE_REVIEW  # Default
    
    def _process_locally(self, text: str, lenses: List[LensType]) -> ProcessResult:
        """Fallback local processing when API unavailable"""
        outputs = {}
        
        for lens in lenses:
            if lens == LensType.ETHICAL:
                outputs[lens] = f"Ethical analysis of: {text[:100]}... Consider privacy, security, and fairness implications."
            elif lens == LensType.EMOTIONAL:
                outputs[lens] = f"Emotional perspective on: {text[:100]}... Focus on user experience and empathy."
            elif lens == LensType.LOGICAL:
                outputs[lens] = f"Logical analysis of: {text[:100]}... Examine structure, efficiency, and reasoning."
            elif lens == LensType.SYMBOLIC:
                outputs[lens] = f"Symbolic interpretation of: {text[:100]}... Look for patterns and deeper meaning."
        
        return ProcessResult(outputs=outputs)
    
    def _synthesize_locally(self, outputs: Dict[LensType, str], blend: float) -> str:
        """Local synthesis fallback"""
        perspectives = list(outputs.values())
        return f"Synthesis of {len(perspectives)} perspectives with {blend:.1%} integration: " + \
               "Consider all viewpoints for a balanced approach to this challenge."

# Convenience functions for common patterns
def analyze_code(code: str, pattern: str = "code_review") -> ProcessResult:
    """Quick code analysis with specified pattern"""
    trivium = TriviumCore()
    
    if pattern == "code_review":
        return trivium.process_with_pattern(code, LensPatterns.CODE_REVIEW)
    elif pattern == "debugging":
        return trivium.process_with_pattern(code, LensPatterns.DEBUGGING)
    else:
        return trivium.process_text(code, [LensType.LOGICAL, LensType.ETHICAL])

def analyze_data(description: str, ethical_focus: bool = True) -> ProcessResult:
    """Analyze data processing with ethical considerations"""
    trivium = TriviumCore()
    
    if ethical_focus:
        return trivium.process_with_pattern(description, LensPatterns.DATA_ANALYSIS)
    else:
        return trivium.process_text(description, [LensType.LOGICAL])

def validate_ml_model(model_description: str) -> ProcessResult:
    """Comprehensive ML model validation"""
    trivium = TriviumCore()
    return trivium.process_with_pattern(model_description, LensPatterns.ML_VALIDATION)