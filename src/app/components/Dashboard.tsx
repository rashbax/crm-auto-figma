import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Language, translations } from '@/app/translations';

interface DashboardProps {
  stats: {
    totalTurnover: number;
    totalSalesCount: number;
    lowStockCount: number;
    totalStock: number;
  };
  lowStockProducts: any[];
  onNavigateToAnalytics: () => void;
  lang: Language;
}

const Card = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <p className="text-gray-400 text-xs mt-1">{subtext}</p>
  </div>
);

export const Dashboard = ({ stats, lowStockProducts, onNavigateToAnalytics, lang }: DashboardProps) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard}</h1>
        <p className="text-gray-500">{lang === 'uz' ? 'Barcha savdo maydonchalaridagi biznesingiz natijalarining qisqacha mazmuni.' : 'Краткая сводка результатов вашего бизнеса на всех площадках.'}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card 
          title={t.totalTurnover} 
          value={`$${stats.totalTurnover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext={lang === 'uz' ? "Birlashtirilgan bozor daromadi" : "Совокупный доход маркетплейсов"}
          icon={TrendingUp}
          trend={12.5}
          color="bg-green-500"
        />
        <Card 
          title={t.totalSales} 
          value={stats.totalSalesCount}
          subtext={lang === 'uz' ? "Jami qayta ishlangan buyurtmalar" : "Всего обработанных заказов"}
          icon={ShoppingBag}
          trend={8.2}
          color="bg-indigo-500"
        />
        <Card 
          title={t.totalStock} 
          value={stats.totalStock}
          subtext={lang === 'uz' ? "Barcha omborlardagi birliklar" : "Единиц на всех складах"}
          icon={Package}
          trend={-2.4}
          color="bg-blue-500"
        />
        <Card 
          title={t.lowStock} 
          value={stats.lowStockCount}
          subtext={lang === 'uz' ? "E'tibor talab qiladigan narsalar" : "Товары, требующие внимания"}
          icon={AlertTriangle}
          color={stats.lowStockCount > 0 ? "bg-amber-500" : "bg-gray-400"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent Alerts Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {t.alerts}
            </h2>
            <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">{t.viewAll}</span>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map(product => (
                <div key={product.id} className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-red-100 mt-1">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-900">{product.name}</h4>
                      <p className="text-xs text-red-700 mt-0.5">
                        SKU: {product.sku} • {product.marketplace}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                         <span className="text-xs font-bold px-2 py-0.5 bg-red-200 text-red-800 rounded">
                           {lang === 'uz' ? 'Zaxira' : 'Запас'}: {product.stock}
                         </span>
                         <span className="text-xs text-red-600">{lang === 'uz' ? 'Chegara' : 'Порог'}: {product.threshold}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success(`${product.sku} uchun zaxira buyurtmasi boshlandi`)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="text-green-500 w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900">{lang === 'uz' ? 'Hamma narsa mavjud' : 'Все в наличии'}</h3>
                <p className="text-sm text-gray-500">{lang === 'uz' ? 'Shoshilinch muammolar aniqlanmadi.' : 'Срочных проблем с запасами не обнаружено.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Insights / Analytics Teaser */}
        <div className="bg-indigo-600 rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">{t.detailedAnalysis}</h2>
            <p className="text-indigo-100 mb-6 max-w-sm">
              {lang === 'uz' ? 'Savdo namunalarini o\'rganing, bozor bo\'yicha filtrlang va vaqt o\'tishi bilan oborot tendentsiyalarini tahlil qiling.' : 'Изучайте паттерны продаж, фильтруйте по площадкам и анализируйте тренды оборота во времени.'}
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-indigo-50 text-opacity-90">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                {lang === 'uz' ? 'Davriy oborot filtrlari' : 'Периодические фильтры оборота'}
              </li>
              <li className="flex items-center gap-2 text-sm text-indigo-50 text-opacity-90">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                {lang === 'uz' ? 'Bozor unumdorligini taqqoslash' : 'Сравнение эффективности площадок'}
              </li>
              <li className="flex items-center gap-2 text-sm text-indigo-50 text-opacity-90">
                <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                {lang === 'uz' ? 'Sotuv hajmini prognoz qilish' : 'Прогнозирование объема продаж'}
              </li>
            </ul>
          </div>
          
          <button 
            onClick={onNavigateToAnalytics}
            className="relative z-10 bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg hover:bg-indigo-50 transition-colors w-fit flex items-center gap-2"
          >
            {t.analytics} <ChevronRight className="w-4 h-4" />
          </button>

          {/* Abstract Background Shapes */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -right-4 top-4 w-32 h-32 bg-indigo-400 rounded-full opacity-30 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};
