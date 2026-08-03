"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, X, ChevronRight, RotateCcw } from "lucide-react";

interface QuizAnswer {
  mood?: string;
  season?: string;
  occasion?: string;
  intensity?: string;
}

const questions = [
  {
    key: "mood",
    title: "What mood are you drawn to?",
    options: [
      { label: "Romantic & Sensual", value: "romantic", emoji: "♥" },
      { label: "Fresh & Energizing", value: "fresh", emoji: "◆" },
      { label: "Mysterious & Bold", value: "bold", emoji: "★" },
      { label: "Elegant & Refined", value: "elegant", emoji: "I" },
    ],
  },
  {
    key: "season",
    title: "Which season feels right?",
    options: [
      { label: "Summer / Warm", value: "summer", emoji: "I" },
      { label: "Winter / Cool", value: "winter", emoji: "II" },
      { label: "Spring / Floral", value: "spring", emoji: "III" },
      { label: "Monsoon / Earthy", value: "monsoon", emoji: "IV" },
    ],
  },
  {
    key: "occasion",
    title: "When will you wear it?",
    options: [
      { label: "Daily / Office", value: "daily", emoji: "I" },
      { label: "Date Night", value: "date", emoji: "II" },
      { label: "Special Events", value: "event", emoji: "III" },
      { label: "Casual Weekends", value: "casual", emoji: "IV" },
    ],
  },
  {
    key: "intensity",
    title: "How strong should it be?",
    options: [
      { label: "Subtle & Soft", value: "light", emoji: "I" },
      { label: "Moderate & Balanced", value: "medium", emoji: "II" },
      { label: "Bold & Lasting", value: "strong", emoji: "III" },
    ],
  },
];

const recommendations: Record<string, { id: string; name: string; reason: string }[]> = {
  "romantic-summer-date": [
    { id: "4", name: "Lumiere Solaire", reason: "Golden warmth meets romantic florals — perfect for a sunset date." },
    { id: "2", name: "Jour Eclat", reason: "Radiant citrus-floral that sparkles in warm weather." },
  ],
  "romantic-winter-event": [
    { id: "1", name: "Noir Cristal", reason: "Deep dark rose and oud create an intoxicating evening presence." },
    { id: "5", name: "Noir Profond", reason: "Leather and cognac for an unforgettable night." },
  ],
  "bold-winter-date": [
    { id: "5", name: "Noir Profond", reason: "Dark sophistication that commands attention." },
    { id: "1", name: "Noir Cristal", reason: "Mystical and mesmerizing for intimate moments." },
  ],
  "fresh-summer-daily": [
    { id: "2", name: "Jour Eclat", reason: "Fresh Mediterranean energy for everyday elegance." },
    { id: "12", name: "Azure Coast", reason: "Aquatic freshness that uplifts your entire day." },
  ],
  "elegant-spring-event": [
    { id: "6", name: "Eclat d'Or", reason: "Liquid gold luxury for your most special occasions." },
    { id: "3", name: "Nocturne Jardin", reason: "Enchanting night garden elegance." },
  ],
};

function getRecommendations(answers: QuizAnswer) {
  const key = `${answers.mood || "romantic"}-${answers.season || "summer"}-${answers.occasion || "daily"}`;
  if (recommendations[key]) return recommendations[key];
  const fallbackKey = `${answers.mood || "romantic"}-${answers.season || "summer"}-daily`;
  if (recommendations[fallbackKey]) return recommendations[fallbackKey];
  return [
    { id: "1", name: "Noir Cristal", reason: "A universally loved masterpiece that suits any mood." },
    { id: "4", name: "Lumiere Solaire", reason: "Versatile elegance that works year-round." },
    { id: "6", name: "Eclat d'Or", reason: "Pure luxury for every occasion." },
  ];
}

export default function FragranceFinder() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [result, setResult] = useState<{ id: string; name: string; reason: string }[] | null>(null);

  const handleAnswer = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult(getRecommendations(newAnswers));
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-[140] flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-body font-semibold text-sm tracking-wider rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow"
      >
        <Sparkles size={16} />
        <span className="hidden sm:inline">Find My Scent</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setOpen(false); reset(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass-gold rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-gold-500" />
                  <h2 className="font-display text-xl text-gradient-gold">Fragrance Finder</h2>
                </div>
                <button onClick={() => { setOpen(false); reset(); }} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Progress */}
              {!result && (
                <div className="px-6 pt-4">
                  <div className="flex gap-1">
                    {questions.map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-gold-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {!result ? (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <p className="text-white/40 text-sm font-body mb-2">Step {step + 1} of {questions.length}</p>
                      <h3 className="font-display text-2xl text-white mb-6">{questions[step].title}</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {questions[step].options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => handleAnswer(questions[step].key, opt.value)}
                            className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all text-left group"
                          >
                            <span className="font-display text-gold-500/50 text-sm mb-2 block">{opt.emoji}</span>
                            <span className="text-white/80 font-body text-sm group-hover:text-gold-500 transition-colors">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-center mb-6">
                        <Sparkles size={32} className="text-gold-500 mx-auto mb-3" />
                        <h3 className="font-display text-2xl text-gradient-gold mb-2">Your Perfect Scents</h3>
                        <p className="text-white/40 font-body text-sm">Based on your preferences</p>
                      </div>
                      <div className="space-y-3">
                        {result.map((rec) => (
                          <Link
                            key={rec.id}
                            href={`/product/${rec.id}`}
                            onClick={() => { setOpen(false); reset(); }}
                            className="block p-4 rounded-xl border border-white/10 bg-white/5 hover:border-gold-500/30 hover:bg-gold-500/5 transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-display text-lg group-hover:text-gold-500 transition-colors">{rec.name}</p>
                                <p className="text-white/40 font-body text-sm mt-1">{rec.reason}</p>
                              </div>
                              <ChevronRight size={18} className="text-white/20 group-hover:text-gold-500 transition-colors" />
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={reset}
                        className="mt-6 w-full py-3 border border-white/10 text-white/60 font-body text-sm rounded-xl hover:border-gold-500/30 hover:text-gold-500 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={14} />
                        Start Over
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
