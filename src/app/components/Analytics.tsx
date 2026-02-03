import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Filter, Globe, Calendar, ArrowRight } from 'lucide-react';
import { DatePicker } from '@/app/components/DatePicker';
import { Language, translations } from '@/app/translations';

interface AnalyticsProps {
  sales: any[];
  marketplaces: string[];
  selectedMarketplace: string;
  setSelectedMarketplace: (mp: any) => void;
  period: number;
  setPeriod: (p: number) => void;
  startDate: Date;
  setStartDate: (d: Date) => void;
  endDate: Date;
  setEndDate: (d: Date) => void;
  filterMode: 'preset' | 'custom';
  setFilterMode: (m: 'preset' | 'custom') => void;
  lang: Language;
}

export const Analytics = ({ 
  sales, 
  marketplaces, 
  selectedMarketplace, 
  setSelectedMarketplace, 
  period, 
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterMode,
  setFilterMode,
  lang
}: AnalyticsProps) => {
  const t = translations[lang];

  const chartData = useMemo(() => {
    const dataMap: Record<string, { date: string, amount: number, sales: number, ozon: number, wildberries: number, uzum: number, timestamp: number }> = {};
    
    // Calculate range
    const start = filterMode === 'preset' ? subDays(new Date(), period - 1) : startDate;
    const end = filterMode === 'preset' ? new Date() : endDate;

    // Filter sales by date range
    const filteredByDate = sales.filter(s => {
      const sDate = new Date(s.date);
      return sDate >= startOfDay(start) && sDate <= endOfDay(end);
    });

    filteredByDate.forEach(s => {
      const d = format(s.date, 'MMM dd');
      if (!dataMap[d]) {
        dataMap[d] = { date: d, amount: 0, sales: 0, ozon: 0, wildberries: 0, uzum: 0, timestamp: s.date.getTime() };
      }
      dataMap[d].amount += s.amount;
      dataMap[d].sales += 1;
      if (s.marketplace === 'Ozon') dataMap[d].ozon += s.amount;
      if (s.marketplace === 'Wildberries') dataMap[d].wildberries += s.amount;
      if (s.marketplace === 'Uzum') dataMap[d].uzum += s.amount;
    });

    return Object.values(dataMap).sort((a, b) => a.timestamp - b.timestamp);
  }, [sales, period, startDate, endDate, filterMode]);

  const marketplaceStats = useMemo(() => {
    const stats: Record<string, number> = { Ozon: 0, Wildberries: 0, Uzum: 0 };
    sales.forEach(s => {
      if (stats[s.marketplace] !== undefined) {
        stats[s.marketplace] += s.amount;
      }
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [sales]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.detailedAnalysis}</h1>
          <p className="text-gray-500">{lang === 'uz' ? 'Sotuvlaringiz unumdorligi va bozor aylanmasini tahlil qiling.' : 'Анализируйте эффективность продаж и оборот на маркетплейсах.'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <Globe className="w-4 h-4 text-gray-400 ml-2" />
            <div className="flex">
              {['All', ...marketplaces].map(mp => (
                <button
                  key={mp}
                  onClick={() => setSelectedMarketplace(mp)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedMarketplace === mp 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mp === 'All' ? t.allMarketplaces : mp}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <div className="flex p-0.5 bg-gray-50 rounded-md mr-1">
              <button 
                onClick={() => setFilterMode('preset')}
                className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${filterMode === 'preset' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}
              >
                {t.preset.toUpperCase()}
              </button>
              <button 
                onClick={() => setFilterMode('custom')}
                className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${filterMode === 'custom' ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400'}`}
              >
                {t.customRange.toUpperCase()}
              </button>
            </div>

            {filterMode === 'preset' ? (
              <div className="flex flex-col gap-1 pr-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">{t.period}</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <select 
                    value={period} 
                    onChange={(e) => setPeriod(Number(e.target.value))}
                    className="py-1.5 text-xs font-medium focus:outline-none bg-transparent"
                  >
                    <option value={7}>{t.last7Days}</option>
                    <option value={30}>{t.last30Days}</option>
                    <option value={90}>{t.last90Days}</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="flex items-end gap-3 pr-2 animate-in fade-in slide-in-from-right-4 duration-300">
                <DatePicker 
                  label={t.fromDate}
                  date={startDate}
                  onChange={setStartDate}
                />
                <div className="mb-2 text-gray-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <DatePicker 
                  label={t.toDate}
                  date={endDate}
                  onChange={setEndDate}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Turnover Chart */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold">{lang === 'uz' ? 'Daromad tendentsiyalari' : 'Тренды выручки'}</h2>
              <p className="text-sm text-gray-500">{selectedMarketplace === 'All' ? t.allMarketplaces : selectedMarketplace} {lang === 'uz' ? 'bo\'yicha kunlik aylanma' : 'ежедневный оборот'}</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value.toFixed(2)}`, lang === 'uz' ? 'Daromad' : 'Выручка']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketplace Comparison */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-2">{lang === 'uz' ? 'Bozor ulushi' : 'Доля рынка'}</h2>
          <p className="text-sm text-gray-500 mb-8">{lang === 'uz' ? 'Umumiy daromad taqsimoti' : 'Распределение общей выручки'}</p>
          
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketplaceStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value.toLocaleString()}`, t.totalTurnover]}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  fill="#4f46e5"
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {marketplaceStats.map((stat, i) => (
              <div key={stat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-indigo-400' : 'bg-indigo-200'}`} />
                  <span className="text-sm font-medium text-gray-600">{stat.name}</span>
                </div>
                <span className="text-sm font-bold">${stat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Sales Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold">{lang === 'uz' ? 'Tarixiy ko\'rsatkichlar' : 'История показателей'}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">{lang === 'uz' ? 'Sana' : 'Дата'}</th>
                <th className="px-6 py-4">{t.totalSales}</th>
                <th className="px-6 py-4">{lang === 'uz' ? 'Oborot' : 'Оборот'}</th>
                <th className="px-6 py-4">{lang === 'uz' ? 'O\'rtacha buyurtma qiymati' : 'Средний чек'}</th>
                <th className="px-6 py-4">{lang === 'uz' ? 'Top bozor' : 'Топ площадка'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[...chartData].reverse().map((day) => (
                <tr key={day.date} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{day.date}</td>
                  <td className="px-6 py-4">{day.sales} {lang === 'uz' ? 'buyurtma' : 'заказов'}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${day.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">${day.sales > 0 ? (day.amount / day.sales).toFixed(2) : '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {[
                        { name: 'Ozon', val: day.ozon },
                        { name: 'Wildberries', val: day.wildberries },
                        { name: 'Uzum', val: day.uzum }
                      ].sort((a,b) => b.val - a.val)[0].name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
