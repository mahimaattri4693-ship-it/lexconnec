## Packages
framer-motion | For beautiful page transitions and micro-interactions
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge tailwind classes without style conflicts

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  sans: ["var(--font-sans)"],
}

App uses custom JWT auth via localStorage. 
A custom `apiFetch` wrapper handles the `Authorization: Bearer <token>` injection for all requests.
Theme is locked to a dark navy and gold professional aesthetic.
