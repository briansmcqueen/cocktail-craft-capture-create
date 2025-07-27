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
				// Style guide color palette
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
					// Deep Forest Green
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
				},
				secondary: {
					// Emerald accent
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					// Fresh mint
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
				// Semantic colors from style guide
				'forest-green': {
					DEFAULT: '#065F46',
					dark: '#064E3B',
				},
				'emerald': '#10B981',
				'fresh-mint': '#6EE7B7',
				'heart-red': '#DC2626',
				'error-red': '#EF4444',
				'warning-amber': '#F59E0B',
				// Neutral grays
				'charcoal': '#1F2937',
				'dark-gray': '#374151',
				'medium-gray': '#6B7280',
				'border-gray': '#E5E7EB',
				'light-gray': '#F9FAFB',
				'off-white': '#FEFDF8',
			},
			borderRadius: {
				lg: "1rem",
				md: "0.75rem",
				sm: "0.5rem",
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
				// Black gradient backgrounds
				"cocktail": "linear-gradient(135deg, #000000 0%, #1A1A1A 50%, #2A2A2A 100%)",
				"cocktail-light": "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
				"cocktail-dark": "linear-gradient(135deg, #000000 0%, #0A0A0A 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
