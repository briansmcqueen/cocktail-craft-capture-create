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
				// Clean black and white theme
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
					// White for primary elements
					DEFAULT: '#FFFFFF',
					foreground: '#000000',
				},
				secondary: {
					// Dark gray for secondary elements
					DEFAULT: '#1F1F1F',
					foreground: '#FFFFFF',
				},
				accent: {
					// Medium gray for accents
					DEFAULT: '#404040',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#2A2A2A',
					foreground: '#A0A0A0',
				},
				destructive: {
					DEFAULT: '#FF4444',
					foreground: '#FFFFFF',
				},
				border: '#333333',
				input: '#1A1A1A',
				ring: '#FFFFFF',
				// Dark sidebar colors
				sidebar: {
					DEFAULT: '#0A0A0A',
					foreground: '#FFFFFF',
					primary: '#FFFFFF',
					'primary-foreground': '#000000',
					accent: '#1F1F1F',
					'accent-foreground': '#FFFFFF',
					border: '#333333',
					ring: '#FFFFFF',
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
				// Black gradient backgrounds
				"cocktail": "linear-gradient(135deg, #000000 0%, #1A1A1A 50%, #2A2A2A 100%)",
				"cocktail-light": "linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)",
				"cocktail-dark": "linear-gradient(135deg, #000000 0%, #0A0A0A 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
