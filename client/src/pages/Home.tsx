import { Link } from "wouter";
import { motion } from "framer-motion";
import { Scale, MessageSquare, ShieldCheck, Search, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-primary" />,
      title: "Find the Right Lawyer",
      description: "Browse verified professionals by specialization, experience, and fee structure."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: "AI Legal Assistant",
      description: "Get instant answers to basic legal questions 24/7 before booking a consultation."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Know Your Rights",
      description: "Access simplified, jargon-free guides on fundamental citizen rights."
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* landing page hero dramatic dark courthouse or scales of justice */}
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop" 
            alt="Courthouse" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
                <Scale className="w-4 h-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Justice Accessible</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
                Bridging the gap between <span className="gold-gradient-text">legal help</span> and you.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                A trustworthy platform connecting citizens with verified legal professionals, 
                empowered by AI to make justice transparent and accessible to everyone.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Get Legal Help <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/know-your-rights"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Explore Your Rights
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Empowering Your Legal Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We provide the tools and connections you need to navigate the legal system with confidence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl hover-card-effect"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
