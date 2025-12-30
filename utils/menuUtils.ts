/**
 * Get the current week of the month (1-4)
 * Weeks are based on which Monday the date falls in
 */
export function getCurrentWeekOfMonth(): number {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentDate = now.getDate();

    // Find the first Monday of the month
    let firstMonday = 1;
    while (new Date(now.getFullYear(), now.getMonth(), firstMonday).getDay() !== 1) {
        firstMonday++;
        if (firstMonday > 7) {
            firstMonday = 1; // If no Monday in first week, start from day 1
            break;
        }
    }

    // Calculate which week we're in
    const daysSinceFirstMonday = currentDate - firstMonday;
    const weekNumber = Math.floor(daysSinceFirstMonday / 7) + 1;

    return Math.max(1, Math.min(4, weekNumber));
}

/**
 * Get dates for each day of a specific week (Monday-Friday)
 * Returns array of dates in DD/MM format
 */
export function getWeekDates(weekNumber: number, month?: number, year?: number): string[] {
    const now = new Date();
    const targetMonth = month ?? now.getMonth();
    const targetYear = year ?? now.getFullYear();

    // Find the first Monday of the month
    let firstMonday = 1;
    while (new Date(targetYear, targetMonth, firstMonday).getDay() !== 1) {
        firstMonday++;
        if (firstMonday > 7) {
            firstMonday = 1;
            break;
        }
    }

    // Calculate the start date for this week
    const startDate = firstMonday + (weekNumber - 1) * 7;

    // Generate dates for Monday through Friday (5 days)
    const dates: string[] = [];
    for (let i = 0; i < 5; i++) {
        const date = new Date(targetYear, targetMonth, startDate + i);
        dates.push(formatDate(date));
    }

    return dates;
}

/**
 * Format date as DD/MM
 */
export function formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
}

/**
 * Get weekday name in Vietnamese
 */
export function getWeekdayName(dayIndex: number): string {
    const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return weekdays[dayIndex];
}

/**
 * Generate initial menu data for a week
 */
export function generateWeekMenuData(weekNumber: number) {
    const dates = getWeekDates(weekNumber);
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];

    return weekdays.map((day, index) => ({
        week: weekNumber,
        dayOfWeek: index + 2, // Monday = 2
        day,
        date: dates[index],
        lunch: '',
        snack: ''
    }));
}
