import React, { useState, useEffect } from 'react';
import { DailyMenu } from '../types';
import { Utensils, CalendarDays, Download } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getCurrentWeekOfMonth } from '../utils/menuUtils';

export const ParentsCorner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'schedule'>('menu');
  const [activeWeek, setActiveWeek] = useState(getCurrentWeekOfMonth());
  const [menuData, setMenuData] = useState<DailyMenu[]>([]);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [monthlyMenuUrl, setMonthlyMenuUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Fetch Menu for current month
        const menuQuery = query(
          collection(db, 'menus'),
          where('month', '==', currentMonth),
          where('year', '==', currentYear)
        );
        const menuSnapshot = await getDocs(menuQuery);
        let menus = menuSnapshot.docs.map(doc => doc.data() as DailyMenu);

        // Sort client-side
        menus = menus.sort((a, b) => {
          if (a.week !== b.week) return a.week - b.week;
          return a.dayOfWeek - b.dayOfWeek;
        });

        // Deduplicate Logic
        // Prioritize correct month/year matching (already filtered by query, but checking prefix is safe)
        // or prioritize content.
        const uniqueMap = new Map<string, DailyMenu>();
        // Construct target ID prefix based on current time (which was used for query)
        const targetIdPrefix = `menu_${currentYear}_${currentMonth}`;

        menus.forEach(item => {
          const key = `${item.week}-${item.dayOfWeek}`;

          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          } else {
            const existing = uniqueMap.get(key)!;

            const currentHasPrefix = item.id?.startsWith(targetIdPrefix);
            const existingHasPrefix = existing.id?.startsWith(targetIdPrefix);

            const currentHasContent = (item.mainMeal || item.morningSnack || '').length > 0;
            const existingHasContent = (existing.mainMeal || existing.morningSnack || '').length > 0;

            let shouldReplace = false;

            if (currentHasPrefix && !existingHasPrefix) {
              shouldReplace = true;
            } else if (currentHasPrefix === existingHasPrefix) {
              if (currentHasContent && !existingHasContent) {
                shouldReplace = true;
              }
            }

            if (shouldReplace) {
              uniqueMap.set(key, item);
            }
          }
        });

        menus = Array.from(uniqueMap.values()).sort((a, b) => {
          if (a.week !== b.week) return a.week - b.week;
          return a.dayOfWeek - b.dayOfWeek;
        });

        setMenuData(menus);

        // Fetch Schedule
        const scheduleQuery = query(collection(db, 'schedules'), orderBy('id', 'asc'));
        const scheduleSnapshot = await getDocs(scheduleQuery);
        const schedules = scheduleSnapshot.docs.map(doc => doc.data());
        setScheduleData(schedules);

        // Fetch monthly menu URL for current month
        const menuSettingsId = `menu_${currentYear}_${currentMonth}`;
        const menuSettingsDoc = await getDoc(doc(db, 'settings', menuSettingsId));

        if (menuSettingsDoc.exists()) {
          setMonthlyMenuUrl(menuSettingsDoc.data()?.monthlyMenuUrl || '');
        } else {
          // Optional: Fallback to global setting if no specific month file found?
          // For now, adhere to explicit month file logic.
          setMonthlyMenuUrl('');
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentWeekMenu = () => {
    return menuData.filter(item => item.week === activeWeek);
  };

  // Fallback to mock data if DB is empty
  const displayMenu = getCurrentWeekMenu().length > 0 ? getCurrentWeekMenu() : [
    { week: 1, dayOfWeek: 2, day: 'Thứ 2', date: '02/12', morningSnack: 'Sữa tươi', mainMeal: 'Thịt kho trứng + Canh', afternoonSnack1: 'Sữa chua', afternoonSnack2: 'Bánh flan' },
    { week: 1, dayOfWeek: 3, day: 'Thứ 3', date: '03/12', morningSnack: 'Sữa hạt', mainMeal: 'Cá chiên + Canh chua', afternoonSnack1: 'Trái cây', afternoonSnack2: 'Chè hạt sen' },
    { week: 1, dayOfWeek: 4, day: 'Thứ 4', date: '04/12', morningSnack: 'Sữa tươi', mainMeal: 'Gà roti + Canh bí', afternoonSnack1: 'Sữa chua', afternoonSnack2: 'Bánh bông lan' },
    { week: 1, dayOfWeek: 5, day: 'Thứ 5', date: '05/12', morningSnack: 'Sữa bắp', mainMeal: 'Thịt luộc + Canh rau', afternoonSnack1: 'Nước cam', afternoonSnack2: 'Cháo sườn' },
    { week: 1, dayOfWeek: 6, day: 'Thứ 6', date: '06/12', morningSnack: 'Sữa tươi', mainMeal: 'Bò xào + Canh cải', afternoonSnack1: 'Dưa hấu', afternoonSnack2: 'Súp cua' },
  ];

  const displaySchedule = scheduleData.length > 0 ? scheduleData : [
    { time: '07:00 - 08:00', activity: 'Đón trẻ, Thể dục sáng, Điểm danh' },
    { time: '08:00 - 08:30', activity: 'Ăn sáng' },
    { time: '08:30 - 10:00', activity: 'Hoạt động học tập & Vui chơi ngoài trời' },
    { time: '10:00 - 11:00', activity: 'Hoạt động góc & Kỹ năng' },
    { time: '11:00 - 12:00', activity: 'Ăn trưa' },
    { time: '12:00 - 14:30', activity: 'Ngủ trưa' },
    { time: '14:30 - 15:30', activity: 'Ăn xế & Vệ sinh cá nhân' },
    { time: '15:30 - 16:30', activity: 'Học năng khiếu / Tiếng Anh' },
    { time: '16:30 - 17:30', activity: 'Trả trẻ' },
  ];

  return (
    <section className="py-16 md:py-24 bg-emerald-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 gap-6">
          <div>
            <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Góc phụ huynh</span>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-gray-900 mt-2">
              Thông tin cần thiết
            </h2>
          </div>

          {/* Custom Tabs Navigation */}
          <div className="bg-white p-1.5 rounded-xl md:rounded-full shadow-sm flex flex-col sm:flex-row w-full md:w-auto border border-gray-100 gap-2 sm:gap-0">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg md:rounded-full font-bold text-sm transition-all duration-300 w-full md:w-auto ${activeTab === 'menu'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
            >
              <Utensils className="w-4 h-4" />
              Thực đơn tuần
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg md:rounded-full font-bold text-sm transition-all duration-300 w-full md:w-auto ${activeTab === 'schedule'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-gray-500 hover:text-brand-600 hover:bg-brand-50'
                }`}
            >
              <CalendarDays className="w-4 h-4" />
              Thời khóa biểu
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-12">
            <Card className="min-h-[400px] border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
              {activeTab === 'menu' ? (
                <div className="p-4 md:p-6">
                  {/* Week Tabs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((week) => (
                        <button
                          key={week}
                          onClick={() => setActiveWeek(week)}
                          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeWeek === week
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          Tuần {week}
                        </button>
                      ))}
                    </div>

                    <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                      <span className="text-emerald-700 font-bold text-sm">
                        Thực đơn {`Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Menu View: Stacked Cards */}
                  <div className="md:hidden space-y-4">
                    {displayMenu.map((item, idx) => (
                      <div key={idx} className={`rounded-xl p-5 shadow-sm border ${item.isHoliday ? 'bg-red-50 border-red-200' : 'bg-white border-emerald-100/50'}`}>
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                          <span className="font-display font-bold text-emerald-700 text-lg">{item.day}</span>
                          <span className="text-xs text-gray-500 font-medium">{item.date}</span>
                        </div>
                        {item.isHoliday ? (
                          <div className="text-center py-4">
                            <p className="text-red-600 font-bold text-lg">🎉 Nghỉ lễ</p>
                            {item.holidayName && <p className="text-sm text-red-500 mt-1">{item.holidayName}</p>}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1.5">Buổi Sáng</p>
                              <div className="pl-3 border-l-2 border-brand-200 space-y-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400">Bữa phụ sáng (08:45)</span>
                                  <span className="text-gray-700 text-sm font-medium">{item.morningSnack}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400">Bữa chính trưa (10:20)</span>
                                  <span className="text-gray-700 text-sm font-medium">{item.mainMeal}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1.5">Buổi Chiều</p>
                              <div className="pl-3 border-l-2 border-emerald-200 space-y-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400">Bữa phụ chiều 1 (13:30)</span>
                                  <span className="text-gray-700 text-sm font-medium">{item.afternoonSnack1}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400">Bữa phụ chiều 2 (15:05)</span>
                                  <span className="text-gray-700 text-sm font-medium">{item.afternoonSnack2}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Menu View: Table */}
                  <div className="hidden md:block overflow-x-auto p-2">
                    <table className="w-full min-w-[900px] border-collapse">
                      <thead>
                        <tr className="bg-emerald-50 text-emerald-800 text-left">
                          <th rowSpan={2} className="p-4 border border-emerald-100 font-display font-bold align-middle">Thứ</th>
                          <th rowSpan={2} className="p-4 border border-emerald-100 font-display font-bold align-middle">Ngày</th>
                          <th colSpan={2} className="p-3 border border-emerald-100 font-display font-bold text-center bg-brand-50/50 text-brand-700">Buổi Sáng</th>
                          <th colSpan={2} className="p-3 border border-emerald-100 font-display font-bold text-center bg-emerald-100/30 text-emerald-700">Buổi Chiều</th>
                        </tr>
                        <tr className="bg-emerald-50/50">
                          {/* Morning Sub-headers */}
                          <th className="p-3 border border-emerald-100 font-medium text-xs text-gray-600 w-1/5">
                            Bữa phụ sáng <br /><span className="text-[10px] text-gray-400">(08:45)</span>
                          </th>
                          <th className="p-3 border border-emerald-100 font-medium text-xs text-gray-600 w-1/5">
                            Bữa chính trưa <br /><span className="text-[10px] text-gray-400">(10:20)</span>
                          </th>
                          {/* Afternoon Sub-headers */}
                          <th className="p-3 border border-emerald-100 font-medium text-xs text-gray-600 w-1/5">
                            Bữa phụ chiều 1 <br /><span className="text-[10px] text-gray-400">(13:30)</span>
                          </th>
                          <th className="p-3 border border-emerald-100 font-medium text-xs text-gray-600 w-1/5">
                            Bữa phụ chiều 2 <br /><span className="text-[10px] text-gray-400">(15:05)</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {displayMenu.map((item, idx) => (
                          <tr key={idx} className={`transition-colors ${item.isHoliday ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                            <td className="p-4 border border-gray-100 font-bold text-gray-800 whitespace-nowrap">{item.day}</td>
                            <td className="p-4 border border-gray-100 text-sm text-gray-500">{item.date}</td>

                            {item.isHoliday ? (
                              <td colSpan={4} className="p-4 border border-gray-100 text-center">
                                <div className="inline-flex items-center gap-2">
                                  <span className="text-red-600 font-bold text-lg">🎉 Nghỉ lễ</span>
                                  {item.holidayName && <span className="text-sm text-red-500">({item.holidayName})</span>}
                                </div>
                              </td>
                            ) : (
                              <>
                                {/* Morning Data */}
                                <td className="p-4 border border-gray-100 text-gray-600 text-sm">
                                  {item.morningSnack}
                                </td>
                                <td className="p-4 border border-gray-100 text-gray-800 font-medium text-sm">
                                  {item.mainMeal}
                                </td>
                                {/* Afternoon Data */}
                                <td className="p-4 border border-gray-100 text-gray-600 text-sm">
                                  {item.afternoonSnack1}
                                </td>
                                <td className="p-4 border border-gray-100 text-emerald-600 font-medium text-sm">
                                  {item.afternoonSnack2}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 text-center md:border-t md:border-gray-100 pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto text-emerald-600 border-emerald-500 hover:bg-emerald-50 gap-2 justify-center"
                      onClick={() => monthlyMenuUrl && window.open(monthlyMenuUrl, '_blank')}
                      disabled={!monthlyMenuUrl}
                    >
                      <Download className="w-4 h-4" />
                      Tải về thực đơn tháng
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 md:p-8">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {displaySchedule.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-8 p-4 rounded-xl hover:bg-brand-50 transition-colors border-b border-gray-50 last:border-0 items-start sm:items-center bg-white sm:bg-transparent shadow-sm sm:shadow-none border sm:border-0 border-gray-100">
                        <div className="w-full sm:w-32 shrink-0 font-bold text-brand-600 bg-brand-50 sm:bg-brand-100 px-3 py-1.5 rounded-md text-left sm:text-center text-sm border-l-4 border-brand-500 sm:border-0">
                          {item.time}
                        </div>
                        <div className="font-medium text-gray-700 pl-2 sm:pl-0 text-sm sm:text-base">
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center md:border-t md:border-gray-100 pt-6">
                    <Button variant="outline" size="sm" className="w-full md:w-auto text-brand-600 border-brand-500 hover:bg-brand-50 gap-2 justify-center">
                      <Download className="w-4 h-4" />
                      Tải về chi tiết chương trình học
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};