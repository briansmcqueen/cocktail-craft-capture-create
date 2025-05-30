
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
				// Cocktail/modern theme colors
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
					// Vibrant purple with a touch of blue
					DEFAULT: '#9b87f5',
					foreground: '#fff',
				},
				secondary: {
					// Pastel peach for complimenting elements
					DEFAULT: '#fde1d3',
					foreground: '#1A1F2C',
				},
				accent: {
					// Soft sky blue accent
					DEFAULT: '#33C3F0',
					foreground: '#fff',
				},
				muted: {
					DEFAULT: '#E5DEFF',
					foreground: '#6E59A5',
				},
				destructive: {
					DEFAULT: '#FF719A',
					foreground: '#fff',
				},
				border: '#E5DEFF',
				input: '#E5DEFF',
				ring: '#A98ED7',
				// Sidebar cocktail dark
				sidebar: {
					DEFAULT: '#24243e',
					foreground: '#D6BCFA',
					primary: '#7E69AB',
					'primary-foreground': '#fff',
					accent: '#fde1d3',
					'accent-foreground': '#24243e',
					border: '#392C56',
					ring: '#A98ED7',
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
				// Cocktail themed gradients (for cards, backgrounds, etc.)
				"cocktail": "linear-gradient(102.3deg, #93278F 5.9%, #EAACE8 64%, #F6DBF5 89%)",
				"cocktail-light": "linear-gradient(135deg, #fdfcfb 0%, #fde1d3 100%)",
				"cocktail-dark": "linear-gradient(120deg, #24243e 0%, #302b63 50%, #8466d4 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
