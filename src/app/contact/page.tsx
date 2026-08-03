'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Linkedin, MapPin, Send, Phone } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-luxury-bg pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-gradient-gold mb-4">
            Get in Touch
          </h1>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
          <p className="text-white/50 font-body text-sm tracking-wider max-w-xl mx-auto">
            Have a question, collaboration idea, or simply want to share your fragrance experience? We would love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-display text-2xl text-white mb-6">Connect With Us</h2>
              <p className="text-white/50 font-body text-sm leading-relaxed mb-8">
                MAISON LUXE is more than a brand — it is a curated experience of luxury and artistry. Whether you need assistance with an order, want to explore a partnership, or simply wish to talk about fragrances, we are here.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href="mailto:thanusham2233@gmail.com"
                className="group flex items-center gap-5 glass rounded-xl p-5 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Mail size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-body tracking-wider uppercase mb-1">Email</p>
                  <p className="text-white font-body group-hover:text-amber-400 transition-colors">thanusham2233@gmail.com</p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/thanusha2233/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 glass rounded-xl p-5 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Linkedin size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-body tracking-wider uppercase mb-1">LinkedIn</p>
                  <p className="text-white font-body group-hover:text-amber-400 transition-colors">linkedin.com/in/thanusha2233</p>
                </div>
              </a>

              <div className="flex items-center gap-5 glass rounded-xl p-5">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-body tracking-wider uppercase mb-1">Location</p>
                  <p className="text-white font-body">India</p>
                </div>
              </div>

              <div className="flex items-center gap-5 glass rounded-xl p-5">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={22} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs font-body tracking-wider uppercase mb-1">Response Time</p>
                  <p className="text-white font-body">Within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl text-white mb-6">Send a Message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-amber-400" />
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">Message Sent</h3>
                  <p className="text-white/50 font-body text-sm">Thank you for reaching out. We will get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-white/40 text-xs font-body tracking-wider uppercase mb-2 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs font-body tracking-wider uppercase mb-2 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-body tracking-wider uppercase mb-2 block">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="text-white/40 text-xs font-body tracking-wider uppercase mb-2 block">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-white/20 resize-none"
                      placeholder="Tell us what is on your mind..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-luxury py-4 bg-gradient-gold text-black font-body font-semibold tracking-wider uppercase text-sm rounded-none hover:glow-gold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
