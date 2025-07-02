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
				// Design System Typography: Satoshi + Inter
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'heading': ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
				'display': ['Satoshi', 'serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Design System Color Palette
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
					DEFAULT: 'hsl(var(--primary))', /* Vibrant Teal */
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))', /* Midnight Slate */
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))', /* Silver Haze */
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				// Additional Design System Colors
				'warm-amber': 'hsl(var(--warm-amber))', /* #FF9F1C */
				'rich-magenta': 'hsl(var(--rich-magenta))', /* #F038FF */
				'silver-haze': 'hsl(var(--silver-haze))', /* #A9A9A9 */
				'nightfall-charcoal': 'hsl(var(--nightfall-charcoal))', /* #1A1A1D */
				'midnight-slate': 'hsl(var(--midnight-slate))', /* #242629 */
				'moonstone-white': 'hsl(var(--moonstone-white))', /* #F5F5F5 */
			},
			borderRadius: {
				lg: "1rem",
				md: "0.75rem", /* 12px */
				sm: "0.5rem", /* 8px */
			},
			spacing: {
				// 8pt Grid System
				'1': '8px',
				'2': '16px',
				'3': '24px',
				'4': '32px',
				'5': '40px',
				'6': '48px',
				'7': '56px',
				'8': '64px',
				'18': '4.5rem',
				'88': '22rem',
			},
			fontSize: {
				// Typography Scale from Design Document
				'h1': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
				'h2': ['20px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
				'h3': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
				'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
				'body-secondary': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
				'button': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
				'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
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
				// Dark theme gradients
				"cocktail": "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)",
				"cocktail-light": "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
				"cocktail-dark": "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--nightfall-charcoal)) 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
