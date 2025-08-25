/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // FreshBites Brand Colors
        brand: {
          violet: {
            50: '#f3f0ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa', // Main brand violet
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95'
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc', // Main brand purple
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87'
          },
          cyan: {
            50: '#ecfeff',
            100: '#cffafe',
            200: '#a5f3fc',
            300: '#67e8f9',
            400: '#22d3ee', // Main accent cyan
            500: '#06b6d4',
            600: '#0891b2',
            700: '#0e7490',
            800: '#155e75',
            900: '#164e63'
          }
        },

        // Simple theme colors - no CSS variables needed
        background: {
          DEFAULT: '#0f172a', // slate-900 (dark)
          light: '#f8fafc',   // slate-50 (light)
        },
        foreground: {
          DEFAULT: '#f8fafc', // slate-50 (dark theme text)
          light: '#0f172a',   // slate-900 (light theme text)
        },

        // Enhanced color palette for FreshBites
        fresh: {
          // Warm colors for energy/power categories
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12'
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843'
          },
          // Cool colors for protein/health categories
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
          },
          // Nature colors for organic/natural elements
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d'
          },
          emerald: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b'
          }
        }
      },
      
      // Enhanced gradients for FreshBites
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        
        // FreshBites specific gradients
        'fresh-brand': 'linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)',
        'fresh-accent': 'linear-gradient(135deg, #22d3ee 0%, #60a5fa 100%)',
        'fresh-warm': 'linear-gradient(135deg, #f472b6 0%, #fb923c 100%)',
        'fresh-cool': 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
        'fresh-nature': 'linear-gradient(135deg, #4ade80 0%, #34d399 100%)',
        'fresh-sunset': 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
      },

      keyframes: {
        // Your existing animation
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        
        // Additional FreshBites animations
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      
      animation: {
        // Your existing animation
        'fade-in': 'fadeIn 0.3s ease-out',
        
        // Additional FreshBites animations
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },

      // Enhanced spacing and sizing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Enhanced typography
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // Enhanced shadows for depth
      boxShadow: {
        'fresh': '0 10px 40px rgba(167, 139, 250, 0.15)',
        'fresh-lg': '0 20px 60px rgba(167, 139, 250, 0.2)',
        'fresh-xl': '0 30px 80px rgba(167, 139, 250, 0.25)',
        'glow-sm': '0 0 20px rgba(167, 139, 250, 0.3)',
        'glow': '0 0 40px rgba(167, 139, 250, 0.4)',
        'glow-lg': '0 0 60px rgba(167, 139, 250, 0.5)',
      },

      // Enhanced border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Backdrop blur utilities
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
      }
    },
  },
  plugins: [],
} 