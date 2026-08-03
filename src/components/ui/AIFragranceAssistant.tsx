"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, Send, X, Bot, User, RotateCcw, ChevronRight, MessageSquare, ListChecks, GitCompare } from "lucide-react";
import Image from "next/image";

/* ─── Types ─── */
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  matchScore: number;
  topNotes: string;
  rating: number;
  stock: number;
  sizes: string[];
  reason: string;
}

interface Comparison {
  product1: { name: string; price: number; notes: string; rating: number; stock: number; sizes: string[] };
  product2: { name: string; price: number; notes: string; rating: number; stock: number; sizes: string[] };
}

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  comparison?: Comparison;
  suggestions?: string[];
  timestamp?: number;
}

/* ─── Quiz Data ─── */
interface QuizAnswer { mood?: string; season?: string; occasion?: string; intensity?: string }

const questions = [
  { key: "mood", title: "What mood are you drawn to?", options: [
    { label: "Romantic & Sensual", value: "romantic" },
    { label: "Fresh & Energizing", value: "fresh" },
    { label: "Mysterious & Bold", value: "bold" },
    { label: "Elegant & Refined", value: "elegant" },
  ]},
  { key: "season", title: "Which season feels right?", options: [
    { label: "Summer / Warm", value: "summer" },
    { label: "Winter / Cool", value: "winter" },
    { label: "Spring / Floral", value: "spring" },
    { label: "Monsoon / Earthy", value: "monsoon" },
  ]},
  { key: "occasion", title: "When will you wear it?", options: [
    { label: "Daily / Office", value: "daily" },
    { label: "Date Night", value: "date" },
    { label: "Special Events", value: "event" },
    { label: "Casual Weekends", value: "casual" },
  ]},
  { key: "intensity", title: "How strong should it be?", options: [
    { label: "Subtle & Soft", value: "light" },
    { label: "Moderate & Balanced", value: "medium" },
    { label: "Bold & Lasting", value: "strong" },
  ]},
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
  return [
    { id: "1", name: "Noir Cristal", reason: "A universally loved masterpiece that suits any mood." },
    { id: "4", name: "Lumiere Solaire", reason: "Versatile elegance that works year-round." },
    { id: "6", name: "Eclat d'Or", reason: "Pure luxury for every occasion." },
  ];
}

const initialSuggestions = [
  "Recommend a perfume for a wedding",
  "I need something under ₹15,000",
  "Fresh fragrance for summer",
  "Gift for my girlfriend",
  "Compare Noir Cristal vs Lumiere Solaire",
  "What is your return policy?",
];

/* ─── Main Component ─── */
export default function AIFragranceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "chat" | "compare">("chat");

  /* Quiz State */
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer>({});
  const [quizResult, setQuizResult] = useState<{ id: string; name: string; reason: string }[] | null>(null);

  /* Chat State */
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to MAISON LUXE. I am your personal fragrance consultant. I can help you discover the perfect perfume, compare products, check orders, or answer any questions about our collection. What brings you here today?", suggestions: initialSuggestions, timestamp: Date.now() },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeTab]);

  /* ─── Quiz Handlers ─── */
  const handleQuizAnswer = (key: string, value: string) => {
    const next = { ...quizAnswers, [key]: value };
    setQuizAnswers(next);
    if (quizStep < questions.length - 1) setQuizStep(quizStep + 1);
    else setQuizResult(getRecommendations(next));
  };

  const resetQuiz = () => { setQuizStep(0); setQuizAnswers({}); setQuizResult(null); };

  /* ─── Chat Handler ─── */
  const handleChatSend = async (overrideText?: string) => {
    const text = overrideText || chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");
    setMessages(prev => [...prev, { role: "user", content: text, timestamp: Date.now() }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/fragrance-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.map(m => m.content) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message || "I could not process that. Please try again.",
        products: data.products,
        comparison: data.comparison,
        suggestions: data.suggestions,
        timestamp: Date.now(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I am experiencing a technical issue. Please try again in a moment.",
        suggestions: ["Try again", "Show me bestsellers"],
        timestamp: Date.now(),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const resetAll = () => {
    resetQuiz();
    setMessages([{
      role: "assistant",
      content: "Welcome to MAISON LUXE. I am your personal fragrance consultant. I can help you discover the perfect perfume, compare products, check orders, or answer any questions about our collection. What brings you here today?",
      suggestions: initialSuggestions,
      timestamp: Date.now(),
    }]);
    setActiveTab("chat");
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`text-[9px] ${s <= Math.round(rating) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
      ))}
    </div>
  );

  return (
    <>
      {/* ─── Floating Button ─── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[140] w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-amber-500/40 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="sparkle" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ─── Panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-[140] w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-700/10 border border-amber-500/20 flex items-center justify-center">
                    <Sparkles size={16} className="text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-serif tracking-wider">Fragrance Assistant</h3>
                    <p className="text-amber-400/60 text-[10px] tracking-widest">AI-POWERED CONSULTANT</p>
                  </div>
                </div>
                <button onClick={resetAll} className="text-white/30 hover:text-white/60 transition-colors" title="Reset">
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {[
                  { key: "chat" as const, label: "Chat", icon: MessageSquare },
                  { key: "quiz" as const, label: "Quiz", icon: ListChecks },
                  { key: "compare" as const, label: "Compare", icon: GitCompare },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-body tracking-wider transition-all ${
                      activeTab === tab.key ? "bg-amber-500/20 text-amber-400" : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    <tab.icon size={13} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* ─── Chat Tab ─── */}
                {activeTab === "chat" && (
                  <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className="space-y-2">
                          {/* Message bubble */}
                          <div className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Bot size={12} className="text-amber-400" />
                              </div>
                            )}
                            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                              msg.role === "user" ? "bg-amber-500/20 text-white/90 rounded-tr-sm" : "bg-white/5 text-white/70 rounded-tl-sm"
                            }`}>
                              {msg.content}
                            </div>
                            {msg.role === "user" && (
                              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <User size={12} className="text-white/60" />
                              </div>
                            )}
                          </div>

                          {/* Products */}
                          {msg.products && msg.products.length > 0 && (
                            <div className="ml-8 space-y-1.5">
                              {msg.products.map((p) => (
                                <Link key={p.id} href={`/product/${p.id}`} onClick={() => setIsOpen(false)} className="block bg-white/5 rounded-xl p-2.5 border border-white/5 hover:border-amber-500/20 transition-all group">
                                  <div className="flex items-start gap-2.5">
                                    {p.image && (
                                      <div className="w-11 h-14 relative rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-white text-xs font-medium truncate">{p.name}</p>
                                        {p.matchScore > 0 && (
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 flex-shrink-0 font-medium">{p.matchScore}%</span>
                                        )}
                                      </div>
                                      <p className="text-white/30 text-[10px] mb-1">{p.brand}</p>
                                      <div className="flex items-center gap-2 mb-1">
                                        {renderStars(p.rating)}
                                        <span className="text-white/20 text-[9px]">{p.rating}</span>
                                      </div>
                                      {p.topNotes && <p className="text-white/25 text-[10px] truncate">Notes: {p.topNotes}</p>}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-amber-400 text-xs font-serif">₹{p.price.toLocaleString("en-IN")}</p>
                                      <p className={`text-[9px] mt-1 ${p.stock > 0 ? 'text-green-400/60' : 'text-red-400/60'}`}>
                                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                      </p>
                                    </div>
                                  </div>
                                  {p.reason && (
                                    <p className="text-white/20 text-[10px] mt-1.5 pl-[52px]">{p.reason}</p>
                                  )}
                                  <div className="flex gap-1 mt-1.5 pl-[52px]">
                                    {p.sizes.map(s => (
                                      <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{s}</span>
                                    ))}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Comparison */}
                          {msg.comparison && (
                            <div className="ml-8">
                              <ComparisonCard comparison={msg.comparison} />
                            </div>
                          )}

                          {/* Suggestions */}
                          {msg.suggestions && msg.suggestions.length > 0 && i === messages.length - 1 && (
                            <div className="ml-8 flex flex-wrap gap-1.5">
                              {msg.suggestions.map((s, j) => (
                                <button
                                  key={j}
                                  onClick={() => handleChatSend(s)}
                                  className="text-[10px] px-2.5 py-1.5 rounded-full border border-amber-500/20 text-amber-400/70 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {chatLoading && (
                        <div className="flex gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Bot size={12} className="text-amber-400" />
                          </div>
                          <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-bounce" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-bounce [animation-delay:0.1s]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-bounce [animation-delay:0.2s]" />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </motion.div>
                )}

                {/* ─── Quiz Tab ─── */}
                {activeTab === "quiz" && (
                  <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
                    {!quizResult ? (
                      <>
                        <div className="flex gap-1 mb-5">
                          {questions.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= quizStep ? "bg-amber-500" : "bg-white/10"}`} />
                          ))}
                        </div>
                        <p className="text-white/30 text-xs font-body mb-1">Step {quizStep + 1} of {questions.length}</p>
                        <h4 className="font-display text-xl text-white mb-5">{questions[quizStep].title}</h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {questions[quizStep].options.map((opt) => (
                            <button key={opt.value} onClick={() => handleQuizAnswer(questions[quizStep].key, opt.value)} className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-left group">
                              <span className="text-white/70 font-body text-sm group-hover:text-amber-400 transition-colors">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-center mb-5">
                          <Sparkles size={24} className="text-amber-400 mx-auto mb-2" />
                          <h4 className="font-display text-xl text-gradient-gold mb-1">Your Perfect Scents</h4>
                          <p className="text-white/30 font-body text-xs">Based on your preferences</p>
                        </div>
                        <div className="space-y-2.5">
                          {quizResult.map((rec) => (
                            <Link key={rec.id} href={`/product/${rec.id}`} onClick={() => setIsOpen(false)} className="block p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all group">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-white font-display text-sm group-hover:text-amber-400 transition-colors">{rec.name}</p>
                                  <p className="text-white/30 font-body text-xs mt-0.5">{rec.reason}</p>
                                </div>
                                <ChevronRight size={16} className="text-white/20 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                              </div>
                            </Link>
                          ))}
                        </div>
                        <button onClick={resetQuiz} className="mt-4 w-full py-2.5 border border-white/10 text-white/50 font-body text-xs rounded-xl hover:border-amber-500/30 hover:text-amber-400 transition-all flex items-center justify-center gap-2">
                          <RotateCcw size={12} /> Start Over
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ─── Compare Tab ─── */}
                {activeTab === "compare" && (
                  <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5">
                    <p className="text-white/40 text-xs font-body mb-4">Select two fragrances to compare side by side.</p>
                    <div className="space-y-2">
                      {[
                        { q: "Compare Noir Cristal vs Lumiere Solaire", label: "Noir Cristal vs Lumiere Solaire" },
                        { q: "Compare Noir Profond vs Eclat d'Or", label: "Noir Profond vs Eclat d'Or" },
                        { q: "Compare Jour Eclat vs Azure Coast", label: "Jour Eclat vs Azure Coast" },
                        { q: "Compare Nocturne Jardin vs Noir Cristal", label: "Nocturne Jardin vs Noir Cristal" },
                      ].map((item) => (
                        <button key={item.q} onClick={() => { setActiveTab("chat"); handleChatSend(item.q); }} className="w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-left group flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <GitCompare size={14} className="text-amber-400/50" />
                            <span className="text-white/70 text-xs font-body group-hover:text-amber-400 transition-colors">{item.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                    <p className="text-white/20 text-[10px] font-body mt-4 text-center">Or type two product names in the Chat tab</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            {activeTab === "chat" && (
              <div className="px-4 py-3 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3.5 py-2 focus-within:border-amber-500/40 transition-colors">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                    placeholder="Ask about fragrances, orders, gifts..."
                    className="flex-1 bg-transparent text-white text-xs placeholder:text-white/30 focus:outline-none"
                  />
                  <button onClick={() => handleChatSend()} disabled={!chatInput.trim() || chatLoading} className="text-amber-400 hover:text-amber-300 disabled:text-white/20 transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Comparison Card ─── */
function ComparisonCard({ comparison }: { comparison: Comparison }) {
  const { product1: p1, product2: p2 } = comparison;
  const rows = [
    { label: "Price", v1: `₹${p1.price.toLocaleString("en-IN")}`, v2: `₹${p2.price.toLocaleString("en-IN")}` },
    { label: "Rating", v1: `${p1.rating}/5`, v2: `${p2.rating}/5` },
    { label: "Notes", v1: p1.notes.slice(0, 40), v2: p2.notes.slice(0, 40) },
    { label: "Sizes", v1: p1.sizes.join(", "), v2: p2.sizes.join(", ") },
    { label: "Stock", v1: p1.stock > 0 ? `${p1.stock} units` : "Out of stock", v2: p2.stock > 0 ? `${p2.stock} units` : "Out of stock" },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden text-xs">
      <div className="grid grid-cols-3 bg-white/5 border-b border-white/5">
        <div className="p-2.5 text-white/30 font-body" />
        <div className="p-2.5 text-amber-400 font-display text-center">{p1.name}</div>
        <div className="p-2.5 text-amber-400 font-display text-center">{p2.name}</div>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={`grid grid-cols-3 ${i < rows.length - 1 ? 'border-b border-white/5' : ''}`}>
          <div className="p-2.5 text-white/30 font-body">{row.label}</div>
          <div className="p-2.5 text-white/70 font-body text-center">{row.v1}</div>
          <div className="p-2.5 text-white/70 font-body text-center">{row.v2}</div>
        </div>
      ))}
    </div>
  );
}
