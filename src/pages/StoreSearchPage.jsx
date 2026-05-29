import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Search, Store, ArrowRight, ShoppingBag, LogOut, Zap } from 'lucide-react';
import RotatingText from '../components/RotatingText';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://customerverse.onrender.com';

export default function StoreSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track auth state for avatar + logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Sign out handler
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/', { replace: true });
  };

  // Fetch all/matching stores
  const fetchStores = async (query = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/search-stores?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores(searchQuery);
  };

  // Avatar helper
  const avatar = user?.photoURL ? (
    <img src={user.photoURL} alt="avatar" referrerPolicy="no-referrer"
      className="w-9 h-9 rounded-full border-2 border-cyan-500 object-cover" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
      {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
    </div>
  );

  useEffect(() => {
    // Dynamically set body background to matching dark theme color
    document.body.style.backgroundColor = '#040408';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-transparent text-slate-100 flex flex-col items-center pb-24 relative overflow-hidden">
      {/* Premium ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* ── Top Navbar ── */}
      <nav className="w-full sticky top-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-slate-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Zap size={15} fill="white" className="text-white" />
            </div>
            <span className="font-display font-black text-base tracking-tighter text-white">
              Customer<span className="text-cyan-400">Verse</span>
            </span>
          </div>

          {/* Right: User + Logout */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {avatar}
                <span className="hidden md:block text-sm font-semibold text-slate-300 max-w-[140px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 text-xs font-bold tracking-widest uppercase transition-all"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Premium Hero Section */}
      <div className="w-full max-w-7xl px-6 pt-24 pb-16 text-center flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-3.5 px-7 py-3.5 rounded-full bg-slate-950/40 border border-purple-500/20 shadow-lg shadow-purple-500/5 mb-8">
          <ShoppingBag size={28} className="text-purple-400" />
          <span className="font-display font-black text-3xl tracking-tight text-white flex items-center">
            <RotatingText
              texts={['Multi', 'Deli', 'Vendor', 'Customer', 'Distributor']}
              mainClassName="text-white overflow-hidden py-0.5 justify-center rounded-lg"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
            <span className="text-cyan-400">Verse</span>
          </span>
        </div>
        <h1 className="font-display font-black text-4xl md:text-6xl tracking-tight text-white max-w-3xl leading-[1.1] mb-6">
          Everything You Need, From <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-400 bg-clip-text text-transparent">Local Vendors</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
          Discover exquisite fashion, state-of-the-art electronics, and premium fresh groceries from trusted neighborhood stores.
        </p>

        {/* Dynamic Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl relative mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands, or stores..."
            className="w-full pl-14 pr-32 py-5 bg-slate-950/60 border border-slate-800 shadow-2xl rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
            <Search size={22} />
          </span>
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stores List Section */}
      <div className="w-full max-w-7xl px-6 relative z-10">
        <div className="flex items-center justify-between border-b border-slate-900 pb-5 mb-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-200 flex items-center gap-2">
            <Store className="text-cyan-400" size={20} />
            Featured Stores ({stores.length})
          </h2>
          <button
            onClick={() => { setSearchQuery(''); fetchStores(''); }}
            className="text-xs font-semibold tracking-wider text-slate-400 hover:text-cyan-400 uppercase transition-colors"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-cyan-400 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium tracking-wide">Searching local directories...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="w-full py-16 px-8 rounded-3xl border border-dashed border-slate-800 text-center flex flex-col items-center bg-slate-950/20">
            <Store className="text-slate-700 mb-4" size={48} />
            <h3 className="text-slate-200 font-bold text-lg mb-1">No Stores Found</h3>
            <p className="text-slate-400 text-sm max-w-xs">We couldn't find any stores matching "{searchQuery}". Try searching for something else.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.store_id}
                onClick={() => navigate(`/store/${store.store_id}`)}
                className="group relative bg-slate-900/30 border border-slate-850 hover:border-purple-500/40 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1 rounded-2xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-950/40 border border-purple-900/30 text-cyan-400 flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-cyan-500 group-hover:text-white transition-all duration-300">
                    <Store size={22} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-purple-400 transition-colors mb-2">
                    {store.store_name}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-slate-500 group-hover:text-cyan-400 text-sm font-bold pt-4 border-t border-slate-900 transition-colors mt-6">
                  <span>Enter Storefront</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
