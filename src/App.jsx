import React, { useState, useEffect } from 'react';
import { Heart, Brain, Users, Target, Share2, Trophy, Beer, Music, Camera, Plane, Coffee, Book } from 'lucide-react';
import confetti from 'canvas-confetti';

const categories = [
  {
    id: 'personality',
    icon: <Brain className="w-8 h-8" />,
    label: "Personality Check",
    options: [
      { text: "Main Character Energy", impact: 15, description: "You're the star of your own show" },
      { text: "Chaotic Good", impact: 12, description: "Breaking rules for the right reasons" },
      { text: "Certified Overthinker", impact: 8, description: "Your brain never stops" },
      { text: "Professional Procrastinator", impact: 5, description: "Why do today what you can do tomorrow?" }
    ]
  },
  {
    id: 'lifestyle',
    icon: <Coffee className="w-8 h-8" />,
    label: "Life Choices",
    options: [
      { text: "Coffee Addict", impact: 10, description: "Running on caffeine and chaos" },
      { text: "Night Owl", impact: 8, description: "3 AM is prime time" },
      { text: "Gym Enthusiast", impact: 12, description: "Gains over everything" },
      { text: "Plant Parent", impact: 7, description: "Your succulents are thriving" }
    ]
  },
  {
    id: 'social',
    icon: <Beer className="w-8 h-8" />,
    label: "Social Life",
    options: [
      { text: "Party Animal", impact: 10, description: "Weekend? What's a weekend?" },
      { text: "Meme Lord", impact: 8, description: "Your group chat game is strong" },
      { text: "Social Butterfly", impact: 12, description: "Everyone's best friend" },
      { text: "Netflix Marathon Pro", impact: 7, description: "One more episode..." }
    ]
  },
  {
    id: 'adventures',
    icon: <Plane className="w-8 h-8" />,
    label: "Life Adventures",
    options: [
      { text: "World Traveler", impact: 15, description: "Passport stamps are your badges" },
      { text: "Food Explorer", impact: 10, description: "Will try anything once" },
      { text: "Spontaneous Spirit", impact: 12, description: "Plans are overrated" },
      { text: "Creative Soul", impact: 8, description: "Life is your canvas" }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'lifeQuizScores';

const App = () => {
  const [nickname, setNickname] = useState('');
  const [selections, setSelections] = useState({});
  const [score, setScore] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allScores, setAllScores] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('party');
  
  useEffect(() => {
    const savedScores = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedScores) {
      setAllScores(JSON.parse(savedScores));
    }
  }, []);

  const saveScore = (newScore) => {
    const scoreData = {
      nickname,
      score: newScore,
      selections,
      timestamp: Date.now()
    };
    
    const updatedScores = [...allScores, scoreData].sort((a, b) => b.score - a.score);
    setAllScores(updatedScores);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedScores));
  };

  const handleSelection = (categoryId, option) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {}),
        [option.text]: !prev[categoryId]?.[option.text]
      }
    }));
  };

  const calculateScore = () => {
    setIsRolling(true);
    let baseScore = 50;
    let bonus = 0;
    
    Object.entries(selections).forEach(([categoryId, options]) => {
      Object.entries(options).forEach(([optionText, isSelected]) => {
        if (isSelected) {
          const option = categories
            .find(c => c.id === categoryId)
            .options.find(o => o.text === optionText);
          bonus += option.impact;
        }
      });
    });

    let finalScore = Math.min(100, Math.max(1, baseScore + bonus + Math.floor(Math.random() * 20) - 10));
    
    setTimeout(() => {
      setScore(finalScore);
      saveScore(finalScore);
      setIsRolling(false);
      setShowResults(true);
      if (finalScore > 70) {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }, 2000);

    // Animated counting effect
    let current = 0;
    const animate = () => {
      if (current < finalScore) {
        current += 2;
        setScore(Math.min(current, finalScore));
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const getRank = () => {
    if (!score) return '';
    const position = allScores.findIndex(s => s.score === score) + 1;
    const total = allScores.length;
    return `Ranked #${position} of ${total}`;
  };

  const getScoreMessage = () => {
    if (score >= 90) return "You're Living Your Best Life! 🌟";
    if (score >= 80) return "Life of the Party! 🎉";
    if (score >= 70) return "Absolutely Crushing It! 💪";
    if (score >= 60) return "Living Pretty Sweet! 🍯";
    if (score >= 50) return "Vibing in the Middle! 🌊";
    if (score >= 40) return "Room for More Fun! 🎮";
    if (score >= 30) return "Time to Level Up! 🎯";
    return "Starting Your Journey! 🌱";
  };

  const shareResult = () => {
    const text = `🎉 Just scored ${score}/100 on Life Vibes Check! ${getScoreMessage()} Try it yourself!`;
    if (navigator.share) {
      navigator.share({
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl mx-auto relative">
        <header className="text-center py-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
            Life Vibes Check
          </h1>
          <p className="text-2xl opacity-90">Rate your chaos, calculate your destiny!</p>
        </header>

        {!showResults ? (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
              <input
                type="text"
                placeholder="What's your vibe name?"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-white/20 rounded-lg px-4 py-3 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-xl"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <div key={category.id} 
                     className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl 
                              transform transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3 mb-4">
                    {category.icon}
                    <h3 className="text-xl font-semibold">{category.label}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {category.options.map((option) => (
                      <button
                        key={option.text}
                        onClick={() => handleSelection(category.id, option)}
                        className={`p-3 rounded-lg text-sm transition-all transform hover:scale-105
                          ${selections[category.id]?.[option.text]
                            ? 'bg-white text-purple-600 font-medium shadow-lg'
                            : 'bg-white/20 hover:bg-white/30'
                          }`}
                      >
                        <div className="font-medium">{option.text}</div>
                        <div className="text-xs opacity-75">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={calculateScore}
                disabled={!nickname || Object.keys(selections).length === 0}
                className={`text-xl px-8 py-4 rounded-full transition-all transform hover:scale-105
                  ${nickname && Object.keys(selections).length > 0
                    ? 'bg-white text-purple-600 hover:bg-white/90 font-bold shadow-xl'
                    : 'bg-white/20 cursor-not-allowed'
                  }`}
              >
                {isRolling ? 'Calculating Your Destiny...' : 'Check Your Vibe!'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center shadow-xl">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-2">{nickname}'s Vibe Score:</h2>
            <div className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-300">
              {score}
            </div>
            <p className="text-2xl mb-2">{getScoreMessage()}</p>
            <p className="text-xl mb-6 opacity-75">{getRank()}</p>
            
            {/* Top Scores Section */}
            <div className="mb-6 bg-white/5 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3">Top Vibes</h3>
              <div className="space-y-2">
                {allScores.slice(0, 5).map((s, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{s.nickname}</span>
                    <span className="font-bold">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setScore(null);
                  setSelections({});
                }}
                className="px-6 py-3 rounded-lg bg-white/20 hover:bg-white/30 transition-all transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={shareResult}
                className="px-6 py-3 rounded-lg bg-white text-purple-600 font-bold hover:bg-white/90 
                         transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Your Vibe
              </button>
            </div>
          </div>
        )}

        <footer className="text-center py-8 opacity-75">
          <p className="text-sm">
            Spread good vibes ✨ by{' '}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              IvyLeague
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;