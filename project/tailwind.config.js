const v = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Nilai warna ada di src/index.css (:root untuk terang, .dark untuk gelap)
        primary: { DEFAULT: v('primary'), 60: v('primary-60'), 10: v('primary-10') },
        ink: v('ink'),
        muted: v('muted'),
        line: v('line'),
        neutral: v('neutral'),
        surface: v('surface'),
        danger: { DEFAULT: v('danger'), 10: v('danger-10') },
        // Status semantik: sengaja redup supaya biru tetap satu-satunya aksen terang
        ok: { DEFAULT: v('ok'), 10: v('ok-10') },
        warn: { DEFAULT: v('warn'), 10: v('warn-10') },
      },
      fontFamily: {
        sans: ['"Rethink Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Rethink Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-display': ['56px', { lineHeight: '67px', letterSpacing: '-3px', fontWeight: '400' }],
        'headline-lg': ['43px', { lineHeight: '56px', letterSpacing: '-3px', fontWeight: '400' }],
        'headline-md': ['33px', { lineHeight: '40px', letterSpacing: '-3px', fontWeight: '400' }],
        'headline-sm': ['26px', { lineHeight: '29px', letterSpacing: '-0.06em', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '30px', letterSpacing: '0px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'label-lg': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '400' }],
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
