import { useState } from "react";
import { useLawyers } from "@/hooks/use-lawyers";
import { useCreateCase } from "@/hooks/use-cases";
import { Search, Briefcase, Star, MapPin, Loader2, Scale, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@shared/schema";

export default function FindLawyer() {
  const [specialization, setSpecialization] = useState("");
  const { data: lawyers, isLoading } = useLawyers(specialization || undefined);
  const [selectedLawyer, setSelectedLawyer] = useState<User | null>(null);

  const specializations = ["All", "Family Law", "Criminal Defense", "Corporate Law", "Property Law", "Cyber Crime"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Find a Lawyer</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our network of verified legal professionals. Filter by expertise and book a consultation directly.
          </p>
        </div>
        
        <div className="w-full md:w-72">
          <label className="text-sm font-medium mb-2 block">Specialization</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value === "All" ? "" : e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-secondary border border-white/10 rounded-xl appearance-none focus:outline-none focus:border-primary text-foreground"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers?.map((lawyer) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={lawyer.id}
              className="glass-panel p-6 rounded-3xl hover-card-effect flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-background border border-white/10 flex items-center justify-center text-xl font-display font-bold">
                  {lawyer.name.charAt(0)}
                </div>
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  Verified
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-1">{lawyer.name}</h3>
              <p className="text-primary font-medium flex items-center gap-2 mb-4">
                <Scale className="w-4 h-4" />
                {lawyer.specialization || "General Practice"}
              </p>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {lawyer.experience || 0} Years Experience
                </p>
                <p className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" /> Bar Council ID: {lawyer.barCouncilId || 'Pending'}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Consultation: ${lawyer.fee || 100}/hr
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedLawyer(lawyer)}
                  className="w-full py-3 rounded-xl bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground font-bold transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            </motion.div>
          ))}
          {lawyers?.length === 0 && (
            <div className="col-span-full text-center py-20 bg-secondary/50 rounded-3xl border border-white/5">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No Lawyers Found</h3>
              <p className="text-muted-foreground">Try adjusting your specialization filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedLawyer && (
          <BookingModal 
            lawyer={selectedLawyer} 
            onClose={() => setSelectedLawyer(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingModal({ lawyer, onClose }: { lawyer: User, onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createCase, isPending } = useCreateCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCase({ lawyerId: lawyer.id, title, description }, {
      onSuccess: () => {
        onClose();
        // Ideally show a toast here
        alert("Case requested successfully! Check your dashboard.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-lg glass-panel p-8 rounded-3xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h2 className="text-2xl font-display font-bold mb-2">Book Consultation</h2>
        <p className="text-muted-foreground mb-6">Requesting a case with <span className="text-primary font-bold">{lawyer.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 pl-1">Case Subject / Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Property Dispute Advice"
              className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-xl focus:outline-none focus:border-primary text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 pl-1">Brief Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide a brief overview of your situation..."
              className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-xl focus:outline-none focus:border-primary text-foreground resize-none"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20 flex items-center justify-center"
            >
              {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Request"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
