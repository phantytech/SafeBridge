import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  HeartHandshake, 
  Shield, 
  Video, 
  Users, 
  Activity,
  Brain,
  Clock,
  Globe,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Lock,
  Smartphone
} from 'lucide-react';

const LearnMore = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SafeBridge Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="font-display font-bold text-xl text-slate-800 leading-tight">SafeBridge</h1>
            <p className="text-xs text-slate-500 font-medium">Bangladesh</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/">
            <button 
              data-testid="button-back-home"
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </Link>
          <Link href="/auth">
            <button 
              data-testid="button-launch-app"
              className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 text-sm"
            >
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-100">
            <Globe size={16} />
            <span>Revolutionizing Communication in Bangladesh</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 leading-tight mb-6">
            Breaking Barriers with <span className="text-primary">AI-Powered</span> Sign Language Translation
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            SafeBridge is more than just a translation tool—it's a comprehensive safety and communication platform designed to empower the deaf and hard-of-hearing community in Bangladesh.
          </p>
        </motion.div>
      </div>

      {/* The Problem Section */}
      <div className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 text-center">
              The Challenge We're Solving
            </h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
              <p>
                In Bangladesh, over 1.5 million people live with hearing disabilities. While sign language serves as their primary mode of communication, most of the population doesn't understand it—creating a significant barrier in everyday interactions.
              </p>
              <p>
                This communication gap becomes even more critical during emergencies. When someone needs to call 999 for help but cannot speak or hear, precious seconds can mean the difference between safety and danger.
              </p>
              <p className="font-semibold text-slate-800">
                SafeBridge was built to eliminate these barriers and ensure everyone has equal access to communication and emergency services.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              How SafeBridge Works
            </h2>
            <p className="text-slate-500 text-lg">
              Advanced AI technology meets intuitive design to deliver real-time sign language translation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Video,
                title: "Camera Activation",
                description: "Simply enable your device's camera through our secure, privacy-focused interface.",
                color: "blue"
              },
              {
                icon: Brain,
                title: "AI Recognition",
                description: "Our MediaPipe-powered AI instantly recognizes hand gestures and movements in real-time.",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Instant Translation",
                description: "Hand signs are converted to text within milliseconds with 98%+ accuracy.",
                color: "yellow"
              },
              {
                icon: Users,
                title: "Clear Communication",
                description: "Translated text appears on screen, enabling seamless conversations with anyone.",
                color: "green"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className={`w-12 h-12 bg-${step.color}-100 rounded-xl flex items-center justify-center text-${step.color}-600 mb-4`}>
                  <step.icon size={24} />
                </div>
                <div className="text-sm font-bold text-slate-400 mb-2">STEP {index + 1}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-slate-500 text-lg">
              Everything you need for safe, accessible communication.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Real-Time Translation",
                description: "Instantly convert hand gestures into text with industry-leading accuracy. No delays, no downloads required.",
                features: ["98%+ accuracy", "Zero latency", "Works offline"]
              },
              {
                icon: Shield,
                title: "Emergency SOS",
                description: "Dedicated gesture recognition for emergencies that automatically connects to Bangladesh's 999 service.",
                features: ["Instant 999 connection", "Location sharing", "Visual confirmation"]
              },
              {
                icon: Lock,
                title: "Privacy First",
                description: "All processing happens in your browser. Your video never leaves your device or gets stored anywhere.",
                features: ["No data storage", "Browser-based AI", "Zero tracking"]
              },
              {
                icon: Clock,
                title: "Lightning Fast",
                description: "Built with cutting-edge MediaPipe technology for instant gesture recognition without lag.",
                features: ["< 100ms response", "60 FPS tracking", "Optimized AI models"]
              },
              {
                icon: Smartphone,
                title: "Works Everywhere",
                description: "Access SafeBridge from any modern device—desktop, tablet, or mobile. No app installation needed.",
                features: ["Cross-platform", "Mobile optimized", "Progressive Web App"]
              },
              {
                icon: HeartHandshake,
                title: "Community Driven",
                description: "Built in collaboration with the deaf community in Bangladesh to ensure cultural relevance and accuracy.",
                features: ["Local sign language", "Community tested", "Regular updates"]
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Built on Cutting-Edge Technology
            </h2>
            <p className="text-slate-500 text-lg">
              We leverage the latest in AI and web technologies to deliver a seamless experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">MediaPipe AI Vision</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Google's state-of-the-art hand tracking technology provides precise gesture recognition with minimal computational requirements. Our models run entirely in your browser for maximum privacy and speed.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Real-time Processing</span>
                <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">21 Hand Landmarks</span>
                <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">3D Tracking</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Modern Web Platform</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Built with React, TypeScript, and modern web standards to ensure a fast, reliable experience across all devices. Progressive Web App technology means you can use SafeBridge even offline.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">React 18</span>
                <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">TypeScript</span>
                <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">PWA Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Making a Real Difference
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-12">
              SafeBridge isn't just about technology—it's about creating equal opportunities, fostering independence, and potentially saving lives. Every conversation enabled, every emergency responded to, represents a step toward a more inclusive Bangladesh.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl font-bold text-primary mb-2">1.5M+</div>
                <div className="text-slate-400">People with hearing disabilities in Bangladesh</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-slate-400">Translation accuracy rate</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-slate-400">Emergency SOS availability</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <button 
                  data-testid="button-get-started"
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 w-full sm:w-auto text-center"
                >
                  Get Started Now
                </button>
              </Link>
              <Link href="/">
                <button 
                  data-testid="button-back-home-footer"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 w-full sm:w-auto text-center"
                >
                  Back to Home
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SafeBridge Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-white">SafeBridge BD</span>
          </div>
          <p className="text-sm">© 2025 SafeBridge. Built for a Safer Bangladesh. 2025inc</p>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;
