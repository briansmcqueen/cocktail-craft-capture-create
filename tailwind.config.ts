import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Journalistic, clean font stack
				'sans': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Fira Sans"', '"Droid Sans"', '"Helvetica Neue"', 'sans-serif'],
				'body': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Premium Bartending App - Dark Theme Color Palette
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					// Deep Forest Green - primary actions, availability indicators
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
				},
				secondary: {
					// Emerald Green - success states, "Can Make" indicators
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					// Fresh Mint - light accents, subtle highlights
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				// Bartending-specific colors
				warning: {
					DEFAULT: 'hsl(var(--warning))', // Golden Amber
					foreground: 'hsl(var(--warning-foreground))',
				},
				copper: {
					DEFAULT: 'hsl(var(--copper))', // Copper Glow
					foreground: 'hsl(var(--copper-foreground))',
				},
				// Direct color values for specific bartending use cases
				'forest-green': {
					DEFAULT: '#065F46',
					dark: '#064E3B',
				},
				'emerald': '#10B981',
				'fresh-mint': '#6EE7B7',
				'golden-amber': '#F59E0B',
				'copper-glow': '#EA580C',
				'heart-red': '#EF4444',
				'error-red': '#EF4444',
				// Dark mode neutral colors
				'rich-charcoal': '#171a21',
				'medium-charcoal': '#374151',
				'light-charcoal': '#4B5563',
				'soft-gray': '#6B7280',
				'light-text': '#D1D5DB',
				'pure-white': '#FFFFFF',
				// Secondary surfaces
				'secondary-surface': '#374151', // Medium Charcoal
				'border-hover': '#6B7280', // Soft Gray for hover states
				'available': '#10B981', // Emerald Green for availability
				// Spirit category colors (with opacity)
				'gin-clear': 'rgba(6, 95, 70, 0.1)',
				'whiskey-amber': 'rgba(245, 158, 11, 0.1)',
				'rum-gold': 'rgba(217, 119, 6, 0.1)',
				'vodka-ice': 'rgba(209, 213, 219, 0.1)',
			},
			borderRadius: {
				lg: "1rem",
				md: "0.75rem",
				sm: "0.5rem",
				// Organic border radius patterns for bartending app
				'organic-sm': '6px 12px 9px 15px',
				'organic-md': '12px 24px 18px 30px',
				'organic-lg': '16px 32px 24px 40px',
				'organic-xl': '24px 48px 36px 60px',
				// Search and input organic shapes
				'organic-pill': '25px 35px 30px 40px',
			},
			spacing: {
				// Style guide spacing scale (4px base unit)
				'xs': '4px',
				'sm': '8px',
				'md': '16px',
				'lg': '24px',
				'xl': '32px',
				'2xl': '48px',
				'3xl': '64px',
				'18': '4.5rem',
				'88': '22rem',
			},
			fontSize: {
				// Style guide typography scale
				'xs': '12px',
				'sm': '14px',
				'base': '16px',
				'lg': '18px',
				'xl': '20px',
				'2xl': '24px',
				'3xl': '28px',
				'4xl': '32px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				"fade-in": {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)",
					},
				},
				"fade-out": {
					"0%": {
						opacity: "1",
						transform: "translateY(0)",
					},
					"100%": {
						opacity: "0",
						transform: "translateY(10px)",
					},
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"scale-out": {
					from: { transform: "scale(1)", opacity: "1" },
					to: { transform: "scale(0.95)", opacity: "0" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-out-right": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(100%)" },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"scale-in": "scale-in 0.2s ease-out",
				"scale-out": "scale-out 0.2s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
				"slide-out-right": "slide-out-right 0.3s ease-out",
				"enter":
					"fade-in 0.3s ease-out, scale-in 0.2s ease-out",
				"exit":
					"fade-out 0.3s ease-out, scale-out 0.2s ease-out",
			},
			backgroundImage: {
				// Premium bartending gradient backgrounds
				"cocktail": "linear-gradient(135deg, #1F2937 0%, #374151 50%, #4B5563 100%)",
				"cocktail-light": "linear-gradient(135deg, #374151 0%, #4B5563 100%)",
				"cocktail-dark": "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
				// Bartending-specific gradients
				"bar-shelf": "linear-gradient(90deg, transparent 0%, #065F46 20%, #10B981 50%, #065F46 80%, transparent 100%)",
				"gin-gradient": "linear-gradient(135deg, rgba(6, 95, 70, 0.1), rgba(6, 95, 70, 0.05))",
				"whiskey-gradient": "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))",
			},
			transitionTimingFunction: {
				// Organic animation curves inspired by cocktail mixing
				'pour': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'shake': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'stir': 'cubic-bezier(0.4, 0, 0.2, 1)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
