/**
 * Generates a unique random string of digits
 * @param {number} length - The length of digits to generate
 * @returns {string} The generated random digits
 */
const generateRandomDigits = (length = 6) => {
    if (length < 1) throw new Error('Length must be at least 1');

    const min = 10 ** (length - 1);
    const max = 10 ** length - 1;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
  
    return random.toString();
};

const getNextDayDate = (dayName, timeString) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIndex = daysOfWeek.indexOf(dayName);
    
    if (targetDayIndex === -1) {
        throw new Error('Invalid day name');
    }
    
    const today = new Date();
    const currentDayIndex = today.getDay();
    
    // Calculate days until target day
    let daysUntilTarget = targetDayIndex - currentDayIndex;
    if (daysUntilTarget <= 0) {
        daysUntilTarget += 7; // Next week if day has passed or is today
    }
    
    // Create the target date
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    // Parse and set the time
    const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
        let [, hours, minutes, ampm] = timeMatch;
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        
        if (ampm.toUpperCase() === 'PM' && hours !== 12) {
            hours += 12;
        } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }
        
        targetDate.setHours(hours, minutes, 0, 0);
    }
    
    return targetDate;
}

const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
  const R = 6371000; // meters
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = {
    generateRandomDigits,
    getNextDayDate,
    getDistanceMeters
};