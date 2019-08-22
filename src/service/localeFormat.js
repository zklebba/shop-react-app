import CONFIG from '../config';

const currencyFormatter = new Intl.NumberFormat(CONFIG.locale, {
    style: 'currency',
    currency: CONFIG.currency,
    minimumFractionDigits: 2
});

const formatMoney = value => value ? currencyFormatter.format(value) : 'free';
const formatDate = value => value ? (new Date(value)).toLocaleString(CONFIG.locale, {
    timeZone: CONFIG.timezone,
}) : '';

export {
    formatMoney,
    formatDate,
};

