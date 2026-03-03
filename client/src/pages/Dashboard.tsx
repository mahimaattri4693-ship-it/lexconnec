import { useState } from "react";
import { useUser, useUpdateProfile } from "@/hooks/use-auth";
import { useCases, useUpdateCase } from "@/hooks/use-cases";
import { FileText, User as UserIcon, Settings, Clock, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: user } = useUser();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-muted-foreground text-lg">
          {user.role === 'lawyer' ? 'Manage your practice and client cases.' : 'Track your legal journey.'}
        </p>
      </div>

      {user.role === 'lawyer' ? <LawyerDashboard user={user} /> : <UserDashboard />}
    </div>
  );
}

function UserDashboard() {
  const { data: cases, isLoading } = useCases();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-primary" /> My Active Cases
        </h2>
        
        {isLoading ? (
          <div className="glass-panel p-12 rounded-3xl flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : cases && cases.length > 0 ? (
          <div className="space-y-4">
            {cases.map((c: any) => (
              <div key={c.id} className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4" style={{ borderLeftColor: c.status === 'Resolved' ? 'hsl(142 71% 45%)' : 'hsl(var(--primary))' }}>
                <div>
                  <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-1">{c.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-secondary`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center">
            <p className="text-muted-foreground mb-4">You don't have any active cases.</p>
            <a href="/find-lawyer" className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">Find a Lawyer</a>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><UserIcon className="text-primary" /> Quick Links</h3>
          <div className="space-y-2">
            <a href="/find-lawyer" className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <span>Book Consultation</span> <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="/ai-chat" className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <span>AI Legal Assistant</span> <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
            <a href="/know-your-rights" className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <span>Rights Guidelines</span> <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LawyerDashboard({ user }: { user: any }) {
  const { data: cases, isLoading } = useCases();
  const { mutate: updateCase } = useUpdateCase();
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();

  const [profileData, setProfileData] = useState({
    specialization: user.specialization || "",
    experience: user.experience || "",
    fee: user.fee || "",
    barCouncilId: user.barCouncilId || "",
    about: user.about || "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profileData,
      experience: parseInt(profileData.experience as any) || 0,
      fee: parseInt(profileData.fee as any) || 0,
    });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FileText className="text-primary" /> Client Requests
        </h2>
        
        {isLoading ? (
          <div className="glass-panel p-12 rounded-3xl flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : cases && cases.length > 0 ? (
          <div className="space-y-4">
            {cases.map((c: any) => (
              <div key={c.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Client ID: {c.userId} • Created {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary uppercase tracking-wide">
                    {c.status}
                  </span>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl mb-2 text-sm text-foreground/80">
                  {c.description}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  {c.status === "Pending" && (
                    <button 
                      onClick={() => updateCase({ id: c.id, status: "In Progress" })}
                      className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:brightness-110"
                    >
                      Accept Case
                    </button>
                  )}
                  {c.status === "In Progress" && (
                    <button 
                      onClick={() => updateCase({ id: c.id, status: "Resolved" })}
                      className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:brightness-110 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl text-center text-muted-foreground">
            No active cases assigned to you.
          </div>
        )}
      </div>

      {/* Profile Editor */}
      <div>
        <div className="glass-panel p-6 rounded-3xl sticky top-28">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="text-primary w-5 h-5" /> Professional Profile
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground pl-1 mb-1 block">Specialization</label>
              <input 
                value={profileData.specialization}
                onChange={e => setProfileData(p => ({...p, specialization: e.target.value}))}
                className="w-full px-3 py-2 bg-secondary border border-white/5 rounded-lg focus:border-primary outline-none" 
                placeholder="e.g. Corporate Law"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="text-xs font-medium text-muted-foreground pl-1 mb-1 block">Experience (Yrs)</label>
                <input 
                  type="number"
                  value={profileData.experience}
                  onChange={e => setProfileData(p => ({...p, experience: e.target.value}))}
                  className="w-full px-3 py-2 bg-secondary border border-white/5 rounded-lg focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground pl-1 mb-1 block">Hourly Fee ($)</label>
                <input 
                  type="number"
                  value={profileData.fee}
                  onChange={e => setProfileData(p => ({...p, fee: e.target.value}))}
                  className="w-full px-3 py-2 bg-secondary border border-white/5 rounded-lg focus:border-primary outline-none" 
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground pl-1 mb-1 block">Bar Council ID</label>
              <input 
                value={profileData.barCouncilId}
                onChange={e => setProfileData(p => ({...p, barCouncilId: e.target.value}))}
                className="w-full px-3 py-2 bg-secondary border border-white/5 rounded-lg focus:border-primary outline-none" 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground pl-1 mb-1 block">About Bio</label>
              <textarea 
                rows={3}
                value={profileData.about}
                onChange={e => setProfileData(p => ({...p, about: e.target.value}))}
                className="w-full px-3 py-2 bg-secondary border border-white/5 rounded-lg focus:border-primary outline-none resize-none" 
              />
            </div>
            <button 
              type="submit" 
              disabled={updatingProfile}
              className="w-full py-2.5 mt-2 bg-primary/20 text-primary border border-primary/30 font-bold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {updatingProfile ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
