
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
				// Modern, trendy font stack
				'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
				'display': ['Playfair Display', 'serif'],
				'body': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Accessible cocktail theme colors with proper contrast
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
					// Deep purple with high contrast
					DEFAULT: '#6B46C1',
					foreground: '#FFFFFF',
				},
				secondary: {
					// Warm cream for elegant contrast
					DEFAULT: '#F8F5F0',
					foreground: '#1F2937',
				},
				accent: {
					// Rich teal for accents
					DEFAULT: '#0D9488',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F3F4F6',
					foreground: '#374151',
				},
				destructive: {
					DEFAULT: '#DC2626',
					foreground: '#FFFFFF',
				},
				border: '#E5E7EB',
				input: '#F9FAFB',
				ring: '#6B46C1',
				// Elegant sidebar colors
				sidebar: {
					DEFAULT: '#1F2937',
					foreground: '#F9FAFB',
					primary: '#6B46C1',
					'primary-foreground': '#FFFFFF',
					accent: '#374151',
					'accent-foreground': '#F9FAFB',
					border: '#374151',
					ring: '#6B46C1',
				},
			},
			borderRadius: {
				lg: "1rem",
				md: "0.75rem",
				sm: "0.5rem",
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
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
				// Elegant, accessible gradients
				"cocktail": "linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A78BFA 100%)",
				"cocktail-light": "linear-gradient(135deg, #F8F5F0 0%, #FFFFFF 100%)",
				"cocktail-dark": "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
