import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAIChat } from "@/hooks/use-ai";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hello. I am the LexConnect Legal Assistant. I can help answer basic legal questions and guide you on your rights. How can I assist you today? (Please note: I provide general information, not formal legal advice.)"
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useAIChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    sendMessage(userMsg, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { 
          role: "ai", 
          content: "I'm sorry, I encountered an error connecting to my knowledge base. Please try asking again." 
        }]);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-display font-bold mb-2">AI Legal Assistant</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          For general guidance. Not a substitute for professional legal advice.
        </p>
      </div>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary border border-white/10"
              }`}>
                {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === "ai" 
                  ? "bg-secondary border border-white/5 rounded-tl-none" 
                  : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/20"
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-secondary border border-white/5 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-muted-foreground text-sm">Analyzing legal context...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-white/5">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your legal issue..."
              className="w-full pl-6 pr-16 py-4 bg-secondary border border-white/10 rounded-2xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground text-lg shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isPending}
              className="absolute right-2 p-2.5 bg-primary text-primary-foreground rounded-xl hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
