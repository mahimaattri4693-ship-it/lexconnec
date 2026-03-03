import { motion } from "framer-motion";
import { BookOpen, Shield, Home, ShoppingBag, ShieldAlert, HeartHandshake } from "lucide-react";
import { useState } from "react";

const rights = [
  {
    id: "cyber",
    icon: <ShieldAlert className="w-8 h-8 text-blue-400" />,
    title: "Cyber Crime",
    content: "If someone is harassing you online, sharing your private photos without consent, or trying to scam you, it is a crime. You don't have to stay silent. Take screenshots of the evidence immediately without engaging. You can report this to the National Cyber Crime portal online without going to a police station initially. The law protects your identity in sensitive cases."
  },
  {
    id: "family",
    icon: <HeartHandshake className="w-8 h-8 text-pink-400" />,
    title: "Family Law & Domestic Violence",
    content: "Domestic violence isn't just physical—it includes emotional and financial abuse too. If you feel unsafe at home, the Protection of Women from Domestic Violence Act provides immediate relief, including right to reside in the shared home and protection orders. You have the right to seek maintenance and custody of your children. Free legal aid is available if you cannot afford a lawyer."
  },
  {
    id: "property",
    icon: <Home className="w-8 h-8 text-green-400" />,
    title: "Property Law",
    content: "Whether you are a tenant or an owner, you have rights. A landlord cannot evict you overnight or cut off essential supplies like water and electricity without a proper legal notice, even if rent is delayed. For ancestral property, daughters have an equal share by birth in Hindu joint family property, regardless of when they were born."
  },
  {
    id: "consumer",
    icon: <ShoppingBag className="w-8 h-8 text-orange-400" />,
    title: "Consumer Rights",
    content: "Bought a defective product or received poor service? You don't have to accept it. The law requires sellers to replace, refund, or repair defective goods. You can file a complaint in the Consumer Court without a lawyer for small amounts. Save your bills and receipts—they are your strongest evidence."
  },
  {
    id: "police",
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    title: "Dealing with Police",
    content: "If you are arrested, you have the right to know the grounds for your arrest immediately. You cannot be detained for more than 24 hours without being presented before a magistrate. Women cannot be arrested after sunset and before sunrise except in exceptional circumstances, and only by a woman police officer."
  }
];

export default function KnowYourRights() {
  const [activeTab, setActiveTab] = useState(rights[0].id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Know Your Rights</h1>
        <p className="text-lg text-muted-foreground">
          The law is meant to protect you, but it only works if you understand it. 
          Here are simple, jargon-free explanations of your fundamental rights in common situations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {rights.map((right) => (
            <button
              key={right.id}
              onClick={() => setActiveTab(right.id)}
              className={`text-left px-6 py-4 rounded-2xl flex items-center gap-4 transition-all ${
                activeTab === right.id 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "glass-panel hover:bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={activeTab === right.id ? "text-primary-foreground" : ""}>
                {right.icon}
              </div>
              <span className="font-bold text-lg">{right.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          {rights.map((right) => (
            activeTab === right.id && (
              <motion.div
                key={right.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-panel p-8 md:p-12 rounded-3xl h-full flex flex-col"
              >
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="p-4 bg-background rounded-2xl border border-white/5">
                    {right.icon}
                  </div>
                  <h2 className="text-3xl font-display font-bold">{right.title}</h2>
                </div>
                
                <div className="prose prose-invert prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-xl">
                    {right.content}
                  </p>
                </div>
                
                <div className="mt-auto pt-12">
                  <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
                    <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5" /> Need specific help?
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Every situation is unique. If you're facing this issue right now, we recommend speaking to our AI assistant for immediate guidance or booking a verified lawyer.
                    </p>
                    <div className="flex gap-4">
                      <a href="/ai-chat" className="text-sm font-bold bg-background text-foreground px-4 py-2 rounded-lg border border-white/10 hover:border-primary transition-colors">Ask AI Assistant</a>
                      <a href="/find-lawyer" className="text-sm font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:brightness-110 transition-colors">Find a Lawyer</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
