import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    occupation: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [scores, setScores] = useState({
    head: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    eyes: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    mouth: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    trunk: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    hips: { E: 0, O: 0, P: 0, M: 0, R: 0 },
    legs: { E: 0, O: 0, P: 0, M: 0, R: 0 }
  });

  const bodyParts = [
    {
      id: 'head',
      name: 'Head Shape',
      descriptions: {
        E: 'Large, elongated head with prominent forehead',
        O: 'Round head with full, chubby cheeks',
        P: 'Triangular, with upper part larger than lower',
        M: 'Square shaped',
        R: 'Harmonious and proportional'
      }
    },
    {
      id: 'eyes',
      name: 'Eyes',
      descriptions: {
        E: 'Unfocused gaze, large eyes, deep dark circles, often wearing glasses',
        O: 'Small eyes. Connecting gaze that shows sadness and emptiness',
        P: 'Evaluating and penetrating gaze. Contracted eyebrows, slightly joined showing anger. Under-eye bags with puffiness',
        M: 'More harmonious design and outline. Seductive intention or connection',
        R: 'Evaluating gaze. Intention of wanting something in return'
      }
    },
    {
      id: 'mouth',
      name: 'Mouth',
      descriptions: {
        E: 'Thin lips, usually colorless',
        O: 'Large mouth with thick, rosy lips. Pout shape with childlike appearance',
        P: 'Crooked smile with one corner higher than the other. Mouth different on left and right sides',
        M: 'Jaw and lips closed and/or with muscle tension. Crooked and disproportionate teeth',
        R: 'Well-defined lips. Aligned and proportional teeth with seductive appearance'
      }
    },
    {
      id: 'trunk',
      name: 'Trunk/Torso',
      descriptions: {
        E: 'Thin, with shoulders and edges protruding',
        O: 'Rounded and soft with sunken chest. Fuller or thin with energy drained sensation',
        P: 'Triangular, with upper part always larger than lower',
        M: 'Square, with weight in shoulders and denser musculature',
        R: 'Well-articulated with well-defined muscles and curves. Hourglass shape'
      }
    },
    {
      id: 'hips',
      name: 'Hips/Buttocks',
      descriptions: {
        E: 'Straight buttocks with little volume. Hip bones very apparent',
        O: 'Round, soft and saggy buttocks. Voluminous or without volume',
        P: 'Buttocks with little volume. Hips wider at top than bottom',
        M: 'Closing buttocks with more tensed muscles',
        R: 'Firm, perky, tight and proportional buttocks'
      }
    },
    {
      id: 'legs',
      name: 'Legs',
      descriptions: {
        E: 'Very thin, with knees locked backward',
        O: 'Shorter, chubby and soft. Thighs much thicker than calves',
        P: 'Smaller in relation to trunk with triangular shape',
        M: 'Very thick with very hard musculature',
        R: 'Shapely, harmonious, proportional with apparent muscle definition'
      }
    }
  ];

  const getTotal = (bodyPartId) => {
    return Object.values(scores[bodyPartId]).reduce((sum, val) => sum + val, 0);
  };

  const handleScoreChange = (bodyPartId, trait, value) => {
    const numValue = Math.max(0, Math.min(10, parseInt(value) || 0));
    const currentTotal = getTotal(bodyPartId);
    const currentScore = scores[bodyPartId][trait];
    const otherScores = currentTotal - currentScore;
    
    if (otherScores + numValue <= 10) {
      setScores(prev => ({
        ...prev,
        [bodyPartId]: {
          ...prev[bodyPartId],
          [trait]: numValue
        }
      }));
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormComplete = formData.name && formData.email && formData.age;
  
  const isSectionComplete = (sectionIndex) => {
    if (sectionIndex === 0) return isFormComplete;
    if (sectionIndex === bodyParts.length + 1) return true; // results page
    const bodyPartId = bodyParts[sectionIndex - 1].id;
    return getTotal(bodyPartId) === 10;
  };

  const calculateResults = () => {
    const totals = { E: 0, O: 0, P: 0, M: 0, R: 0 };
    Object.values(scores).forEach(bodyPart => {
      Object.entries(bodyPart).forEach(([trait, score]) => {
        totals[trait] += score;
      });
    });
    
    const percentages = {};
    Object.entries(totals).forEach(([trait, score]) => {
      percentages[trait] = Math.round((score / 60) * 100);
    });
    
    return { totals, percentages };
  };

  // Function removed - not currently used but kept for future functionality

 const handleSubmit = () => {
  const results = calculateResults();
  
  const payload = {
    name: formData.name,
    email: formData.email,
    age: formData.age,
    occupation: formData.occupation,
    scores: results.totals,
    percentages: results.percentages
  };

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrBAFXjXDeG30ZpBhnmve03HG_N0e2LChiuiD7B__KXLSvIBy_VhTIJTTB9MVc3jrr/exec';

  // Avança para a tela de resultados IMEDIATAMENTE, sem esperar o Sheets
  setCurrentSection(prev => prev + 1);
  setSubmitted(true);

  // Envia os dados em segundo plano (fire and forget)
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(error => {
    console.error('Erro ao enviar para Google Sheets:', error);
    setSubmitError(true);
  });
};

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Character Blueprint Assessment</h2>
        <p className="text-gray-600 mb-6">
          This assessment analyzes your physical characteristics to reveal your unique character structure. 
          Please fill in your information to begin.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleFormChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleFormChange('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your age"
            min="18"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation (Optional)</label>
          <input
            type="text"
            value={formData.occupation}
            onChange={(e) => handleFormChange('occupation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your profession"
          />
        </div>
      </div>
    </div>
  );

  const renderBodyPartSection = (bodyPart) => {
    const total = getTotal(bodyPart.id);
    const remaining = Math.max(0, 10 - total);
    const isComplete = total === 10;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{bodyPart.name}</h2>
          <p className="text-gray-600 mb-4">
            Distribute exactly <strong>10 points</strong> across the descriptions below based on how well each matches your physical characteristics.
          </p>
          
          <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
            isComplete ? 'bg-green-50 border border-green-200' : 
            total > 10 ? 'bg-red-50 border border-red-200' : 
            'bg-blue-50 border border-blue-200'
          }`} key={total}>
            {isComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Complete! Total: {total}/10 points</span>
              </>
            ) : total > 10 ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 font-medium">Too many points! Total: {total}/10 (Remove {total - 10} points)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">Total: {total}/10 points | Remaining: {remaining} points</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(bodyPart.descriptions).map(([trait, description]) => (
            <div key={trait} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="text-gray-700 flex-1">{description}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={scores[bodyPart.id][trait]}
                    onChange={(e) => handleScoreChange(bodyPart.id, trait, e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center font-semibold"
                  />
                  <span className="text-gray-500 text-sm">pts</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(scores[bodyPart.id][trait] / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const { percentages } = calculateResults();
    const sortedTraits = Object.entries(percentages).sort(([,a], [,b]) => b - a);
    
    const traitNames = {
      E: 'Schizoid',
      O: 'Oral',
      P: 'Psychopath',
      M: 'Masochist',
      R: 'Rigid'
    };

    const traitDescriptions = {
      E: 'Creative, imaginative, and highly intellectual. You live in a rich inner world.',
      O: 'Warm, sensitive, and deeply caring. You thrive on connection and emotional bonds.',
      P: 'Strategic, leadership-oriented, and goal-driven. You excel at planning and execution.',
      M: 'Resilient, detail-oriented, and committed. You have exceptional endurance.',
      R: 'Charming, competitive, and performance-driven. You shine in social situations.'
    };

    const dominantTrait = sortedTraits[0][0];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Character Blueprint</h2>
          <p className="text-gray-600 mb-6">
            Here's a preview of your character structure analysis. 
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Character Traits Distribution</h3>
          <div className="space-y-3">
            {sortedTraits.map(([trait, percentage]) => (
              <div key={trait}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">{traitNames[trait]}</span>
                  <span className="font-bold text-gray-900">{percentage}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-indigo-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Your Dominant Trait: {traitNames[dominantTrait]}</h3>
          <p className="text-gray-700 mb-4">{traitDescriptions[dominantTrait]}</p>
          <p className="text-sm text-gray-600 italic">
            This is just a glimpse. Your complete analysis reveals how ALL your traits interact, your core fears, superpowers, and personalized strategies for growth.
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
          <h4 className="font-bold text-yellow-900 mb-2 text-lg">🎁 Your detailed FREE report will be sent to <strong>{formData.email}</strong></h4>
          <p className="text-yellow-800 mb-3">
            You've unlocked your basic character blueprint! Want to discover:
          </p>
          <ul className="text-yellow-800 space-y-2 ml-4 mb-4">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Detailed analysis of each trait and how they interact</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Your core fears and superpowers for each trait</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Relationship patterns and compatibility insights</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Career guidance based on your character structure</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Personalized development strategies and action plan</span>
            </li>
          </ul>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://humantraitlab.gumroad.com/l/characterblueprint-standard', '_blank')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Complete Analysis (15-20 pages) - $27.00
            </button>
            
            <button 
              onClick={() => window.open('https://humantraitlab.gumroad.com/l/characterblueprint-premium', '_blank')}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Premium Analysis (25-30 pages + Bonuses) - $47.00
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>📧 Check your email for your free sample report</p>
          <p className="italic">
            Note: This analysis is for self-discovery and entertainment purposes only. 
            Not a substitute for professional psychological advice.
          </p>
        </div>
      </div>
    );
  };

  const sections = [
    { id: 0, name: 'Personal Info', component: renderPersonalInfo },
    ...bodyParts.map((bp, idx) => ({ 
      id: idx + 1, 
      name: bp.name, 
      component: () => renderBodyPartSection(bp) 
    })),
    { id: bodyParts.length + 1, name: 'Results', component: renderResults }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentSection + 1} of {sections.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentSection + 1) / sections.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            {sections[currentSection].component()}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0 || submitted}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            
            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => {
                  // Se é a última seção antes dos resultados, dispara o submit junto
                  if (currentSection === sections.length - 2) {
                    handleSubmit();
                  } else {
                    setCurrentSection(prev => prev + 1);
                  }
                }}
                disabled={!isSectionComplete(currentSection)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {currentSection === sections.length - 2 ? 'See My Results ✨' : 'Next'}
              </button>
            ) : (
              <div className="px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-lg font-medium border border-green-300">
                {submitError ? '⚠️ Submission error — check console' : '✅ Assessment submitted!'}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Based on Character Structure Analysis Theory (Wilhelm Reich & Alexander Lowen)</p>
        </div>
      </div>
    </div>
  );
}

export default App;
