import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Instagram } from 'lucide-react';
import RetroFrame from './RetroFrame';
import GlitchText from './GlitchText';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-vt323 text-5xl md:text-6xl text-neon-cyan mb-4 tracking-widest glow-text-cyan">
            <GlitchText intensity="medium" triggerProbability={0.25} triggerInterval={5000}>
              CONTACT UPLINK
            </GlitchText>
          </h1>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mb-8"></div>
          <p className="font-vt323 text-lg text-white/80 max-w-2xl mx-auto">
            Ready to collaborate? Let's discuss your next project or just say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <RetroFrame variant="dark">
            <div className="p-8">
              <h2 className="font-vt323 text-2xl text-neon-pink mb-6 tracking-widest glow-text-pink">
                TRANSMISSION FORM
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4" data-netlify="true">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-vt323 text-neon-cyan mb-2 text-sm tracking-wide">
                      OPERATOR NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-cyberpunk-black/50 border-2 border-neon-cyan/50 text-white font-vt323 px-4 py-3 rounded focus:border-neon-cyan focus:outline-none transition-colors"
                      placeholder="Enter your designation"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-vt323 text-neon-cyan mb-2 text-sm tracking-wide">
                      EMAIL FREQUENCY
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-cyberpunk-black/50 border-2 border-neon-cyan/50 text-white font-vt323 px-4 py-3 rounded focus:border-neon-cyan focus:outline-none transition-colors"
                      placeholder="your.email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-vt323 text-neon-cyan mb-2 text-sm tracking-wide">
                    TRANSMISSION SUBJECT
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-cyberpunk-black/50 border-2 border-neon-cyan/50 text-white font-vt323 px-4 py-3 rounded focus:border-neon-cyan focus:outline-none transition-colors"
                    placeholder="Mission objective"
                  />
                </div>

                <div>
                  <label className="block font-vt323 text-neon-cyan mb-2 text-sm tracking-wide">
                    MESSAGE CONTENT
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full bg-cyberpunk-black/50 border-2 border-neon-cyan/50 text-white font-vt323 px-4 py-3 rounded focus:border-neon-cyan focus:outline-none transition-colors resize-none"
                    placeholder="Describe your mission parameters..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan text-cyberpunk-black font-vt323 py-3 px-6 rounded tracking-wider font-bold transition-all hover:shadow-lg hover:shadow-neon-pink/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyberpunk-black mr-2"></div>
                      TRANSMITTING...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="mr-2" size={20} />
                      INITIATE TRANSMISSION
                    </span>
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-400 font-vt323 text-sm"
                  >
                    ✓ Transmission successful! Message received.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-red-400 font-vt323 text-sm"
                  >
                    ✗ Transmission failed. Please retry.
                  </motion.div>
                )}
              </form>
            </div>
          </RetroFrame>

          {/* Contact Information */}
          <div className="space-y-8">
            <RetroFrame variant="dark">
              <div className="p-8">
                <h2 className="font-vt323 text-2xl text-neon-cyan mb-6 tracking-widest glow-text-cyan">
                  DIRECT CHANNELS
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-pink/20 p-3 rounded-lg">
                      <Mail className="text-neon-pink" size={24} />
                    </div>
                    <div>
                      <p className="font-vt323 text-white/80 text-sm tracking-wide">EMAIL FREQUENCY</p>
                      <a 
                        href="mailto:farbodroshanii@gmail.com" 
                        className="font-vt323 text-neon-cyan hover:text-neon-pink transition-colors"
                      >
                        farbodroshanii@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-cyan/20 p-3 rounded-lg">
                      <Phone className="text-neon-cyan" size={24} />
                    </div>
                    <div>
                      <p className="font-vt323 text-white/80 text-sm tracking-wide">COMMUNICATION LINK</p>
                      <p className="font-vt323 text-neon-cyan">Available upon request</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-neon-purple/20 p-3 rounded-lg">
                      <MapPin className="text-neon-purple" size={24} />
                    </div>
                    <div>
                      <p className="font-vt323 text-white/80 text-sm tracking-wide">OPERATION BASE</p>
                      <p className="font-vt323 text-neon-cyan">Tehran, Iran</p>
                    </div>
                  </div>
                </div>
              </div>
            </RetroFrame>

            <RetroFrame variant="dark">
              <div className="p-8">
                <h2 className="font-vt323 text-2xl text-neon-pink mb-6 tracking-widest glow-text-pink">
                  SOCIAL NETWORKS
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://github.com/farbodroshani"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-cyberpunk-black/50 border border-neon-cyan/30 rounded-lg hover:border-neon-cyan transition-colors group"
                  >
                    <Github className="text-neon-cyan group-hover:text-neon-pink transition-colors" size={24} />
                    <span className="font-vt323 text-white group-hover:text-neon-cyan transition-colors">GitHub</span>
                  </a>

                  <a
                    href="https://linkedin.com/in/farbodroshani"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-cyberpunk-black/50 border border-neon-cyan/30 rounded-lg hover:border-neon-cyan transition-colors group"
                  >
                    <Linkedin className="text-neon-cyan group-hover:text-neon-pink transition-colors" size={24} />
                    <span className="font-vt323 text-white group-hover:text-neon-cyan transition-colors">LinkedIn</span>
                  </a>

                  <a
                    href="https://instagram.com/farbodroshanii"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 bg-cyberpunk-black/50 border border-neon-cyan/30 rounded-lg hover:border-neon-cyan transition-colors group"
                  >
                    <Instagram className="text-neon-cyan group-hover:text-neon-pink transition-colors" size={24} />
                    <span className="font-vt323 text-white group-hover:text-neon-cyan transition-colors">Instagram</span>
                  </a>

                  <a
                    href="mailto:farbodroshanii@gmail.com"
                    className="flex items-center space-x-3 p-4 bg-cyberpunk-black/50 border border-neon-cyan/30 rounded-lg hover:border-neon-cyan transition-colors group"
                  >
                    <Mail className="text-neon-cyan group-hover:text-neon-pink transition-colors" size={24} />
                    <span className="font-vt323 text-white group-hover:text-neon-cyan transition-colors">Email</span>
                  </a>
                </div>
              </div>
            </RetroFrame>

            {/* Quick Stats */}
            <RetroFrame variant="dark">
              <div className="p-8">
                <h2 className="font-vt323 text-2xl text-neon-cyan mb-6 tracking-widest glow-text-cyan">
                  RESPONSE TIME
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="font-vt323 text-3xl text-neon-pink mb-2">24h</div>
                    <div className="font-vt323 text-white/80 text-sm">Average Response</div>
                  </div>
                  <div className="text-center">
                    <div className="font-vt323 text-3xl text-neon-cyan mb-2">100%</div>
                    <div className="font-vt323 text-white/80 text-sm">Response Rate</div>
                  </div>
                </div>
              </div>
            </RetroFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
