import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Info, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  LogOut, 
  Settings,
  Trash2,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Mail
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link: string;
  category: string;
}

interface ResumeEntry {
  id: number;
  title: string;
  company: string;
  duration: string;
  description: string;
  type: 'experience' | 'education';
}

// --- Components ---

const ProfileCard = ({ name, icon: Icon, onClick, color }: { name: string, icon: any, onClick: () => void, color: string }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center gap-4 cursor-pointer group"
    onClick={onClick}
  >
    <div className={cn(
      "w-32 h-32 md:w-40 md:h-40 rounded-md flex items-center justify-center transition-all duration-300 border-2 border-transparent group-hover:border-white",
      color
    )}>
      <Icon size={64} className="text-white opacity-80 group-hover:opacity-100" />
    </div>
    <span className="text-gray-400 text-xl md:text-2xl group-hover:text-white transition-colors">
      {name}
    </span>
  </motion.div>
);

const SectionRow = ({ title, items, onSelect }: { title: string, items: any[], onSelect: (item: any) => void }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row px-4 md:px-12 mb-8">
      <h2 className="text-white text-lg md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white"
        >
          <ChevronLeft size={40} />
        </button>
        <div 
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto no-scrollbar pb-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05, zIndex: 20 }}
              className="flex-none w-48 md:w-64 aspect-video bg-zinc-800 rounded-sm cursor-pointer overflow-hidden relative group"
              onClick={() => onSelect(item)}
            >
              <img 
                src={item.image_url || `https://picsum.photos/seed/${item.id}/400/225`} 
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-sm md:text-base">{item.title}</h3>
                <p className="text-gray-300 text-xs line-clamp-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
};

const Modal = ({ item, onClose, isAdmin, onDelete }: { item: any, onClose: () => void, isAdmin: boolean, onDelete?: (id: number) => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-zinc-900 w-full max-w-4xl rounded-xl overflow-hidden relative"
      onClick={e => e.stopPropagation()}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/80"
      >
        <X size={24} />
      </button>

      <div className="aspect-video w-full relative">
        <img 
          src={item.image_url || `https://picsum.photos/seed/${item.id}/1200/675`} 
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{item.title}</h2>
          <div className="flex gap-4">
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white text-black px-8 py-2 rounded font-bold hover:bg-gray-200 transition-colors"
              >
                <Play size={20} fill="black" /> Visit Site
              </a>
            )}
            {isAdmin && onDelete && (
              <button 
                onClick={() => {
                  if (confirm('Are you sure?')) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-8 py-2 rounded font-bold hover:bg-red-700 transition-colors"
              >
                <Trash2 size={20} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <p className="text-white text-lg leading-relaxed">
            {item.description}
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-gray-500 text-sm">Category:</span>
            <p className="text-white">{item.category || 'Portfolio'}</p>
          </div>
          {item.company && (
            <div>
              <span className="text-gray-500 text-sm">Company:</span>
              <p className="text-white">{item.company}</p>
            </div>
          )}
          {item.duration && (
            <div>
              <span className="text-gray-500 text-sm">Duration:</span>
              <p className="text-white">{item.duration}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'profiles' | 'main' | 'admin'>('profiles');
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [resume, setResume] = useState<ResumeEntry[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchData();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    const [pRes, rRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/resume')
    ]);
    setProjects(await pRes.json());
    setResume(await rRes.json());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPassword })
    });
    if (res.ok) {
      setIsAdmin(true);
      setView('main');
    } else {
      alert('Wrong password');
    }
  };

  const addProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    fetchData();
    (e.target as HTMLFormElement).reset();
  };

  const deleteProject = async (id: number) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const deleteResume = async (id: number) => {
    await fetch(`/api/resume/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (view === 'profiles') {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-3xl md:text-5xl font-medium mb-12"
        >
          Who's exploring?
        </motion.h1>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          <ProfileCard 
            name="Resume" 
            icon={Briefcase} 
            color="bg-blue-600" 
            onClick={() => { setActiveProfile('Resume'); setView('main'); }} 
          />
          <ProfileCard 
            name="Projects" 
            icon={Code} 
            color="bg-red-600" 
            onClick={() => { setActiveProfile('Projects'); setView('main'); }} 
          />
          <ProfileCard 
            name="About" 
            icon={User} 
            color="bg-green-600" 
            onClick={() => { setActiveProfile('About'); setView('main'); }} 
          />
          <ProfileCard 
            name="Contact" 
            icon={Mail} 
            color="bg-yellow-600" 
            onClick={() => { setActiveProfile('Contact'); setView('main'); }} 
          />
        </div>
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setView('admin')}
          className="mt-16 px-8 py-2 border border-gray-600 text-gray-600 hover:text-white hover:border-white transition-colors uppercase tracking-widest text-sm"
        >
          Manage Profiles
        </motion.button>
      </div>
    );
  }

  if (view === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-black/50 p-8 rounded-lg w-full max-w-md border border-zinc-800">
          <h2 className="text-white text-2xl font-bold mb-6">Admin Login</h2>
          <input 
            type="password" 
            placeholder="Password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            className="w-full bg-zinc-800 text-white p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setView('profiles')}
            className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-300",
        isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"
      )}>
        <div className="flex items-center gap-8">
          <h1 
            className="text-red-600 text-2xl md:text-4xl font-black cursor-pointer tracking-tighter"
            onClick={() => setView('profiles')}
          >
            PORTFOLIO
          </h1>
          <div className="hidden md:flex gap-6 text-sm">
            <button onClick={() => setActiveProfile('Resume')} className={cn("hover:text-gray-300 transition-colors", activeProfile === 'Resume' && "font-bold")}>Resume</button>
            <button onClick={() => setActiveProfile('Projects')} className={cn("hover:text-gray-300 transition-colors", activeProfile === 'Projects' && "font-bold")}>Projects</button>
            <button onClick={() => setActiveProfile('About')} className={cn("hover:text-gray-300 transition-colors", activeProfile === 'About' && "font-bold")}>About</button>
            <button onClick={() => setActiveProfile('Contact')} className={cn("hover:text-gray-300 transition-colors", activeProfile === 'Contact' && "font-bold")}>Contact</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => setIsAdmin(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-xs font-bold">
            {activeProfile?.[0] || 'U'}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <img 
          src="https://picsum.photos/seed/portfolio-hero/1920/1080" 
          alt="Hero"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        
        <div className="absolute bottom-[20%] left-4 md:left-12 max-w-2xl">
          <h2 className="text-4xl md:text-7xl font-bold mb-4">Welcome to My World</h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3">
            I'm a passionate developer building high-quality web experiences. This portfolio is a collection of my journey, projects, and skills, presented in a way you've never seen before.
          </p>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
              <Play size={24} fill="black" /> Get Started
            </button>
            <button className="flex items-center gap-2 bg-gray-500/50 text-white px-8 py-3 rounded font-bold hover:bg-gray-500/70 transition-colors">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Content Rows */}
      <div className="-mt-32 relative z-10 space-y-8 pb-20">
        {activeProfile === 'Projects' || !activeProfile ? (
          <>
            <SectionRow 
              title="Featured Projects" 
              items={projects.filter(p => p.category === 'Featured')} 
              onSelect={setSelectedItem} 
            />
            <SectionRow 
              title="Web Applications" 
              items={projects.filter(p => p.category === 'Web')} 
              onSelect={setSelectedItem} 
            />
            <SectionRow 
              title="Creative Works" 
              items={projects.filter(p => p.category === 'Creative')} 
              onSelect={setSelectedItem} 
            />
          </>
        ) : null}

        {activeProfile === 'Resume' && (
          <div className="px-4 md:px-12 max-w-4xl mx-auto pt-20">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="text-red-600" /> Experience
            </h2>
            <div className="space-y-12">
              {resume.filter(r => r.type === 'experience').map(entry => (
                <div key={entry.id} className="border-l-2 border-red-600 pl-8 relative">
                  <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-[9px] top-0" />
                  <h3 className="text-2xl font-bold">{entry.title}</h3>
                  <p className="text-red-600 font-medium mb-2">{entry.company} • {entry.duration}</p>
                  <p className="text-gray-400 leading-relaxed">{entry.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold mb-8 mt-20 flex items-center gap-3">
              <GraduationCap className="text-red-600" /> Education
            </h2>
            <div className="space-y-12">
              {resume.filter(r => r.type === 'education').map(entry => (
                <div key={entry.id} className="border-l-2 border-red-600 pl-8 relative">
                  <div className="absolute w-4 h-4 bg-red-600 rounded-full -left-[9px] top-0" />
                  <h3 className="text-2xl font-bold">{entry.title}</h3>
                  <p className="text-red-600 font-medium mb-2">{entry.company} • {entry.duration}</p>
                  <p className="text-gray-400 leading-relaxed">{entry.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeProfile === 'About' && (
          <div className="px-4 md:px-12 max-w-4xl mx-auto pt-20 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-red-600 flex-none">
              <img src="https://picsum.photos/seed/me/400/400" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">About Me</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                I'm a software engineer with a passion for building beautiful, functional, and user-centric applications. With expertise in modern web technologies, I strive to create digital experiences that leave a lasting impression.
              </p>
              <div className="flex gap-4">
                <div className="bg-zinc-800 p-4 rounded-lg flex-1">
                  <h4 className="font-bold text-red-600 mb-1">10+</h4>
                  <p className="text-sm text-gray-400">Projects Completed</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg flex-1">
                  <h4 className="font-bold text-red-600 mb-1">5+</h4>
                  <p className="text-sm text-gray-400">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeProfile === 'Contact' && (
          <div className="px-4 md:px-12 max-w-2xl mx-auto pt-20 text-center">
            <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>
            <p className="text-gray-400 mb-12">
              Whether you have a question or just want to say hi, my inbox is always open!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="mailto:hello@example.com" className="bg-zinc-800 p-8 rounded-xl hover:bg-zinc-700 transition-colors flex flex-col items-center gap-4">
                <Mail size={40} className="text-red-600" />
                <span className="font-bold">Email Me</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-zinc-800 p-8 rounded-xl hover:bg-zinc-700 transition-colors flex flex-col items-center gap-4">
                <ExternalLink size={40} className="text-red-600" />
                <span className="font-bold">LinkedIn</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => setSelectedItem({ type: 'add' })}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          >
            <Plus size={32} />
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedItem && selectedItem.type !== 'add' && (
          <Modal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            isAdmin={isAdmin}
            onDelete={deleteProject}
          />
        )}

        {selectedItem?.type === 'add' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-zinc-900 p-8 rounded-xl w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
              <form onSubmit={async (e) => { await addProject(e); setSelectedItem(null); }} className="space-y-4">
                <input name="title" placeholder="Title" required className="w-full bg-zinc-800 p-3 rounded" />
                <textarea name="description" placeholder="Description" required className="w-full bg-zinc-800 p-3 rounded h-32" />
                <input name="image_url" placeholder="Image URL (optional)" className="w-full bg-zinc-800 p-3 rounded" />
                <input name="link" placeholder="Project Link" className="w-full bg-zinc-800 p-3 rounded" />
                <select name="category" className="w-full bg-zinc-800 p-3 rounded">
                  <option value="Featured">Featured</option>
                  <option value="Web">Web</option>
                  <option value="Creative">Creative</option>
                </select>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-red-600 py-3 rounded font-bold">Save Project</button>
                  <button type="button" onClick={() => setSelectedItem(null)} className="flex-1 bg-zinc-700 py-3 rounded font-bold">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
