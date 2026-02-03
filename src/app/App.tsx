import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  ShoppingBag,
  Globe,
  Settings,
  HelpCircle,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { subDays } from 'date-fns';
import { Toaster } from 'sonner';
import { Dashboard } from '@/app/components/Dashboard';
import { Analytics } from '@/app/components/Analytics';
import { Ads } from '@/app/components/Ads';
import { translations, Language } from '@/app/translations';

// --- Types ---
type Marketplace = 'Ozon' | 'Wildberries' | 'Uzum' | 'All';
type View = 'dashboard' | 'analytics' | 'inventory' | 'ads';

interface SaleRecord {
  id: string;
  date: Date;
  amount: number;
  items: number;
  marketplace: Marketplace;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
  price: number;
  marketplace: Marketplace;
  category: string;
}

// --- Mock Data ---
const MARKETPLACES: Marketplace[] = ['Ozon', 'Wildberries', 'Uzum'];

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Wireless Headphones', sku: 'WH-1000XM4', stock: 12, threshold: 15, price: 299.99, marketplace: 'Ozon', category: 'Electronics' },
  { id: '2', name: 'Mechanical Keyboard', sku: 'KBD-RGB-80', stock: 45, threshold: 20, price: 129.50, marketplace: 'Uzum', category: 'Computing' },
  { id: '3', name: 'Ergonomic Desk Chair', sku: 'CH-ERG-01', stock: 3, threshold: 5, price: 349.00, marketplace: 'Ozon', category: 'Furniture' },
  { id: '4', name: 'USB-C Hub 7-in-1', sku: 'HUB-71', stock: 150, threshold: 30, price: 45.00, marketplace: 'Wildberries', category: 'Accessories' },
  { id: '5', name: 'Smart Watch Series 7', sku: 'SW-S7-BLK', stock: 8, threshold: 10, price: 399.00, marketplace: 'Uzum', category: 'Wearables' },
  { id: '6', name: 'Leather Laptop Sleeve', sku: 'LS-LTH-14', stock: 2, threshold: 10, price: 59.99, marketplace: 'Ozon', category: 'Accessories' },
  { id: '7', name: 'Noise Cancelling Earbuds', sku: 'EB-NC-02', stock: 65, threshold: 15, price: 189.00, marketplace: 'Wildberries', category: 'Electronics' },
  { id: '8', name: '4K Gaming Monitor', sku: 'MON-4K-27', stock: 5, threshold: 8, price: 549.99, marketplace: 'Uzum', category: 'Computing' },
];

const generateSales = (): SaleRecord[] => {
  const sales: SaleRecord[] = [];
  for (let i = 0; i < 90; i++) {
    const date = subDays(new Date(), i);
    MARKETPLACES.forEach(mp => {
      const count = Math.floor(Math.random() * 5) + 1;
      for (let j = 0; j < count; j++) {
        sales.push({
          id: `${i}-${mp}-${j}`,
          date,
          amount: Math.random() * 500 + 50,
          items: Math.floor(Math.random() * 3) + 1,
          marketplace: mp
        });
      }
    });
  }
  return sales;
};

const MOCK_SALES = generateSales();

export default function App() {
  const [lang, setLang] = useState<Language>('ru');
  const t = translations[lang];
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace>('All');
  const [period, setPeriod] = useState<number>(30);
  const [filterMode, setFilterMode] = useState<'preset' | 'custom'>('preset');
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters & Aggregations
  const filteredSales = useMemo(() => {
    let sales = MOCK_SALES;
    if (selectedMarketplace !== 'All') {
      sales = sales.filter(s => s.marketplace === selectedMarketplace);
    }
    
    const start = filterMode === 'preset' ? subDays(new Date(), period) : startDate;
    const end = filterMode === 'preset' ? new Date() : endDate;
    
    return sales.filter(s => s.date >= start && s.date <= end);
  }, [selectedMarketplace, period, filterMode, startDate, endDate]);

  const filteredProducts = useMemo(() => {
    if (selectedMarketplace === 'All') return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.marketplace === selectedMarketplace);
  }, [selectedMarketplace]);

  const stats = useMemo(() => {
    const totalTurnover = filteredSales.reduce((sum, s) => sum + s.amount, 0);
    const totalSalesCount = filteredSales.length;
    const lowStockCount = filteredProducts.filter(p => p.stock <= p.threshold).length;
    const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0);

    return { totalTurnover, totalSalesCount, lowStockCount, totalStock };
  }, [filteredSales, filteredProducts]);

  const lowStockProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.stock <= p.threshold);
  }, []);

  const NavItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        currentView === view 
          ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
      <Toaster position="top-right" />
      
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-[#005bff] to-[#22d3ee] flex items-center justify-center text-white font-bold text-[14px] shadow-lg shadow-indigo-100">
            R&J
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Rubi&Jons</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <NavItem view="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          <NavItem view="analytics" icon={TrendingUp} label={t.analytics} />
          <NavItem view="ads" icon={Zap} label={t.ads} />
          <NavItem view="inventory" icon={Package} label={t.inventory} />
          
          

          <div className="pt-6 pb-2 px-4 border-t border-gray-100 mt-4 lg:hidden">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Language / Til</span>
          </div>
          <div className="flex px-4 gap-2 lg:hidden">
            <button 
              onClick={() => setLang('uz')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${lang === 'uz' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${lang === 'ru' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}
            >
              RU
            </button>
          </div>
        </nav>

        <div className="p-4 space-y-1 border-t border-gray-100 shrink-0">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            <Settings className="w-4 h-4" /> {t.settings}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            <HelpCircle className="w-4 h-4" /> {t.help}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-40 lg:hidden transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-[#005bff] to-[#22d3ee] flex items-center justify-center text-white font-bold text-[14px]">
              R&J
            </div>
            <span className="text-lg font-bold">Rubi&Jons</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <nav className="px-4 py-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          <NavItem view="analytics" icon={TrendingUp} label={t.analytics} />
          <NavItem view="ads" icon={Zap} label={t.ads} />
          <NavItem view="inventory" icon={Package} label={t.inventory} />
          
          <div className="pt-4 flex gap-2">
            <button 
              onClick={() => setLang('uz')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${lang === 'uz' ? 'bg-indigo-600 text-white' : 'bg-gray-50'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${lang === 'ru' ? 'bg-indigo-600 text-white' : 'bg-gray-50'}`}
            >
              RU
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 items-center justify-end sticky top-0 z-10">
          <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setLang('uz')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${lang === 'uz' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${lang === 'ru' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
              RU
            </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-[#005bff] to-[#22d3ee] flex items-center justify-center text-white font-bold text-[12px]">
              R&J
            </div>
            <span className="font-bold">Rubi&Jons</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLang('uz')}
              className={`px-2 py-1 text-[10px] font-bold rounded border ${lang === 'uz' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              UZ
            </button>
            <button 
              onClick={() => setLang('ru')}
              className={`px-2 py-1 text-[10px] font-bold rounded border ${lang === 'ru' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}
            >
              RU
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              lowStockProducts={lowStockProducts}
              onNavigateToAnalytics={() => setCurrentView('analytics')}
              lang={lang}
            />
          )}

          {currentView === 'analytics' && (
            <Analytics 
              sales={MOCK_SALES}
              marketplaces={MARKETPLACES}
              selectedMarketplace={selectedMarketplace}
              setSelectedMarketplace={(mp) => setSelectedMarketplace(mp)}
              period={period}
              setPeriod={setPeriod}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
              lang={lang}
            />
          )}

          {currentView === 'ads' && (
            <Ads products={MOCK_PRODUCTS} lang={lang} />
          )}

          {currentView === 'inventory' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center animate-in fade-in zoom-in duration-300">
               <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
               <h2 className="text-xl font-bold">{t.inventory}</h2>
               <p className="text-gray-500 mt-2">{t.comingSoon}</p>
               <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
               >
                 {t.backToDashboard}
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
