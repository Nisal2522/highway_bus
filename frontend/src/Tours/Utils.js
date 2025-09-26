// utils.js

// Font size control
export const changeFontSize = (size) => {
    const root = document.documentElement;
    switch(size) {
        case 'small': root.style.fontSize = '14px'; break;
        case 'medium': root.style.fontSize = '16px'; break;
        case 'large': root.style.fontSize = '18px'; break;
        default: root.style.fontSize = '16px';
    }
};

// High contrast toggle
export const toggleContrast = () => {
    const body = document.body;
    const currentFilter = body.style.filter;
    body.style.filter = currentFilter ? '' : 'contrast(150%) brightness(120%)';
    return !currentFilter;
};

// Date formatting
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
};

// Sample routes
export const routes = {
    'passara-colombo': { operator: 'NCG Express - Super Luxury', departure: '12:20 AM', arrival: '06:00 AM', duration: '5Hr 40Min', price: '2,200 LKR', seats: 8, via: 'Bandarawela' },
    'colombo-passara': { operator: 'Island Express - Luxury', departure: '10:30 PM', arrival: '04:10 AM', duration: '5Hr 40Min', price: '2,100 LKR', seats: 12, via: 'Bandarawela' },
    'kandy-colombo': { operator: 'Hill Country Express', departure: '07:00 AM', arrival: '10:30 AM', duration: '3Hr 30Min', price: '1,500 LKR', seats: 15, via: 'Kegalle' },
    'colombo-kandy': { operator: 'Hill Country Express', departure: '02:00 PM', arrival: '05:30 PM', duration: '3Hr 30Min', price: '1,500 LKR', seats: 20, via: 'Kegalle' },
    'galle-colombo': { operator: 'Southern Express', departure: '06:00 AM', arrival: '08:30 AM', duration: '2Hr 30Min', price: '1,200 LKR', seats: 25, via: 'Kalutara' },
    'colombo-galle': { operator: 'Southern Express', departure: '04:00 PM', arrival: '06:30 PM', duration: '2Hr 30Min', price: '1,200 LKR', seats: 18, via: 'Kalutara' }
};

// Cities data
export const cities = [
    { value: 'colombo', label: 'Colombo' },
    { value: 'passara', label: 'Passara' },
    { value: 'kandy', label: 'Kandy' },
    { value: 'galle', label: 'Galle' },
    { value: 'jaffna', label: 'Jaffna' },
    { value: 'trincomalee', label: 'Trincomalee' },
    { value: 'batticaloa', label: 'Batticaloa' },
    { value: 'matara', label: 'Matara' }
];

// Generate trip data
export const generateTripData = (from, to, date) => {
    const routeKey = `${from}-${to}`;
    const route = routes[routeKey];
    if (!route) return null;

    const fromName = from.charAt(0).toUpperCase() + from.slice(1);
    const toName = to.charAt(0).toUpperCase() + to.slice(1);

    return {
        id: `${from}-${to}-${date}`,
        from: fromName,
        to: toName,
        fromValue: from,
        toValue: to,
        date: formatDate(date),
        ...route
    };
};
