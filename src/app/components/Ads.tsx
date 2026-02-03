import React, { useMemo } from 'react';
import { 
  Zap, 
  Minus, 
  Power, 
  PowerOff, 
  Search,
  Package,
  ExternalLink
} from 'lucide-react';
import { Language, translations } from '@/app/translations';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
  price: number;
  marketplace: string;
  category: string;
}

interface AdsProps {
  products: Product[];
  lang: Language;
}

type Recommendation = 'Turn On' | 'Turn Off' | 'Don\'t Touch';

export const Ads = ({ products, lang }: AdsProps) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'All' | Recommendation>('All');

  const getRecommendation = (stock: number, threshold: number): Recommendation => {
    if (stock <= threshold) return 'Turn Off';
    if (stock > threshold * 4) return 'Turn On';
    return 'Don\'t Touch';
  };

  const getStatusLabel = (rec: Recommendation) => {
    if (rec === 'Turn On') return t.turnOn;
    if (rec === 'Turn Off') return t.turnOff;
    return t.dontTouch;
  };

  const getStatusColor = (rec: Recommendation) => {
    switch (rec) {
      case 'Turn On': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Turn Off': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Don\'t Touch': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (rec: Recommendation) => {
    switch (rec) {
      case 'Turn On': return <Power className="w-4 h-4" />;
      case 'Turn Off': return <PowerOff className="w-4 h-4" />;
      case 'Don\'t Touch': return <Minus className="w-4 h-4" />;
    }
  };

  const adProducts = useMemo(() => {
    return products.map(p => ({
      ...p,
      recommendation: getRecommendation(p.stock, p.threshold)
    })).filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'All' || p.recommendation === filter;
      return matchesSearch && matchesFilter;
    });
  }, [products, searchQuery, filter]);

  const stats = useMemo(() => {
    const turnOn = adProducts.filter(p => p.recommendation === 'Turn On').length;
    const turnOff = adProducts.filter(p => p.recommendation === 'Turn Off').length;
    const dontTouch = adProducts.filter(p => p.recommendation === 'Don\'t Touch').length;
    return { turnOn, turnOff, dontTouch };
  }, [adProducts]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.adOptimizer}</h1>
          <p className="text-gray-500 text-sm mt-1">{lang === 'uz' ? 'Zaxira darajasiga asoslangan aqlli tavsiyalar' : 'Умные рекомендации на основе уровня запасов'}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                <Zap className="w-3.5 h-3.5 fill-indigo-700" />
                {t.aiActive}
            </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Power className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{t.boost}</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t.turnOn}</p>
          <p className="text-2xl font-black mt-1">{stats.turnOn} <span className="text-sm font-normal text-gray-400">{lang === 'uz' ? 'Mahsulotlar' : 'Товаров'}</span></p>
          <p className="text-[10px] text-gray-400 mt-2">{lang === 'uz' ? 'Yuqori zaxira darajasi' : 'Обнаружен высокий уровень запасов'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <PowerOff className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{t.pause}</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t.turnOff}</p>
          <p className="text-2xl font-black mt-1">{stats.turnOff} <span className="text-sm font-normal text-gray-400">{lang === 'uz' ? 'Mahsulotlar' : 'Товаров'}</span></p>
          <p className="text-[10px] text-gray-400 mt-2">{lang === 'uz' ? 'Zaxira tugash xavfi bor' : 'Риск отсутствия товара на складе'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Minus className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{t.maintain}</span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t.dontTouch}</p>
          <p className="text-2xl font-black mt-1">{stats.dontTouch} <span className="text-sm font-normal text-gray-400">{lang === 'uz' ? 'Mahsulotlar' : 'Товаров'}</span></p>
          <p className="text-[10px] text-gray-400 mt-2">{lang === 'uz' ? 'Sog\'lom zaxira aylanmasi' : 'Здоровая оборачиваемость запасов'}</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button 
              onClick={() => setFilter('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {t.all}
            </button>
            <button 
              onClick={() => setFilter('Turn On')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'Turn On' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {t.turnOn}
            </button>
            <button 
              onClick={() => setFilter('Turn Off')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'Turn Off' ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {t.turnOff}
            </button>
            <button 
              onClick={() => setFilter('Don\'t Touch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filter === 'Don\'t Touch' ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {t.dontTouch}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'uz' ? 'Mahsulot va SKU' : 'Товар и SKU'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{t.stockThreshold}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{lang === 'uz' ? 'Maydoncha' : 'Площадка'}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{t.recommendation}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adProducts.length > 0 ? adProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</span>
                      <span className="text-[10px] font-medium text-gray-400">{product.sku}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${product.stock <= product.threshold ? 'text-rose-600' : product.stock > product.threshold * 4 ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                        <span className="text-gray-300">/</span>
                        <span className="text-xs text-gray-500">{product.threshold}</span>
                      </div>
                      <div className="w-20 bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock <= product.threshold ? 'bg-rose-500' : product.stock > product.threshold * 4 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.min((product.stock / (product.threshold * 4)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold border border-gray-200 uppercase">
                      {product.marketplace}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(product.recommendation)}`}>
                      {getStatusIcon(product.recommendation)}
                      {getStatusLabel(product.recommendation)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Package className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm font-medium">{t.noProducts}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              {t.autoRules}
            </h3>
            <p className="text-indigo-200 text-sm leading-relaxed">
              {t.autoRulesDesc}
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors whitespace-nowrap">
            {t.configure}
          </button>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-700 rounded-full blur-3xl opacity-30" />
      </div>
    </div>
  );
};
