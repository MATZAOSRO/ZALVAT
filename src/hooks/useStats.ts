import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { startOfWeek, endOfWeek, startOfDay, endOfDay, isWithinInterval, subWeeks, format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';
import { DrinkType } from '../types';

export function useStats() {
  const { consumos } = useAppContext();
  const { user } = useAuth();

  const limiteSemanal = user?.limite_sugerido || 10;

  const stats = useMemo(() => {
    const now = new Date();
    
    // Helper to filter consumos by interval (excluding water)
    const getAlcoholInInterval = (start: Date, end: Date) => {
      return consumos.filter(c => 
        c.tipo !== 'agua' && 
        c.tipo !== 'mocktail' && 
        isWithinInterval(c.timestamp, { start, end })
      );
    };

    // Current Week (starts Sunday)
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 0 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 0 });
    const currentWeekConsumos = getAlcoholInInterval(startOfCurrentWeek, endOfCurrentWeek);
    const weeklyUnits = currentWeekConsumos.reduce((sum, c) => sum + (Number(c.unidades) || 0), 0);

    // Previous Week
    const startOfPrevWeek = subWeeks(startOfCurrentWeek, 1);
    const endOfPrevWeek = subWeeks(endOfCurrentWeek, 1);
    const prevWeekConsumos = getAlcoholInInterval(startOfPrevWeek, endOfPrevWeek);
    const prevWeeklyUnits = prevWeekConsumos.reduce((sum, c) => sum + (Number(c.unidades) || 0), 0);

    // Current Day
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    const todayConsumos = getAlcoholInInterval(startOfToday, endOfToday);
    const dailyUnits = todayConsumos.reduce((sum, c) => sum + (Number(c.unidades) || 0), 0);

    // Current Month
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const currentMonthConsumos = getAlcoholInInterval(startOfCurrentMonth, endOfCurrentMonth);
    const monthlyUnits = currentMonthConsumos.reduce((sum, c) => sum + (Number(c.unidades) || 0), 0);

    // Daily Average (this week)
    const daysPassedThisWeek = now.getDay() + 1; // 0 = Sunday, so +1
    const dailyAverage = weeklyUnits / daysPassedThisWeek;

    // Highest Consumption Day (this week)
    const unitsByDay = currentWeekConsumos.reduce((acc, c) => {
      acc[c.fecha_formateada] = (acc[c.fecha_formateada] || 0) + (Number(c.unidades) || 0);
      return acc;
    }, {} as Record<string, number>);
    
    let highestDay = { date: '-', units: 0 };
    for (const [date, units] of Object.entries(unitsByDay)) {
      if (units > highestDay.units) {
        highestDay = { date, units };
      }
    }

    // Chart Data: Last 7 days
    const last7Days = eachDayOfInterval({ start: subDays(now, 6), end: now });
    const barChartData = last7Days.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const dayConsumos = consumos.filter(c => c.fecha_formateada === formattedDate && c.tipo !== 'agua' && c.tipo !== 'mocktail');
      const units = dayConsumos.reduce((sum, c) => sum + (Number(c.unidades) || 0), 0);
      return {
        name: format(date, 'EEE'), // Mon, Tue...
        unidades: units,
        fullDate: formattedDate
      };
    });

    // Chart Data: Proportion by Type (all time or this month)
    const typeProportion = currentMonthConsumos.reduce((acc, c) => {
      acc[c.tipo] = (acc[c.tipo] || 0) + (Number(c.unidades) || 0);
      return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(typeProportion).map(([name, value]) => ({
      name,
      value
    }));

    // Most consumed drink type
    let mostConsumedType: DrinkType | 'todas' = 'todas';
    let maxUnits = 0;
    for (const [type, units] of Object.entries(typeProportion)) {
      if (units > maxUnits) {
        maxUnits = units;
        mostConsumedType = type as DrinkType;
      }
    }

    return {
      weeklyUnits,
      prevWeeklyUnits,
      dailyUnits,
      monthlyUnits,
      dailyAverage,
      highestDay,
      barChartData,
      pieChartData,
      mostConsumedType,
      limiteSemanal,
      isOverLimit: weeklyUnits > limiteSemanal,
      progressPercentage: Math.min(100, (weeklyUnits / limiteSemanal) * 100)
    };
  }, [consumos, limiteSemanal]);

  return stats;
}
