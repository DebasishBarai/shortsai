// Theme configuration to be used across the application
export const themeConfig = {
  // Button variants
  button: {
    primary: "bg-gradient-primary hover:bg-gradient-primary-hover text-white shadow-lg shadow-blue-500/25 border-0",
    secondary: "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700",
  },
  
  // Section styling
  section: {
    default: "py-16 md:py-24",
    gradient: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
    subtle: "bg-slate-50 dark:bg-slate-900",
    plain: "bg-white dark:bg-slate-900",
  },
  
  // Card styling
  card: {
    default: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm",
    hover: "hover:shadow-md transition-shadow",
    feature: "bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700",
  },
  
  // Heading styling
  heading: {
    gradient: "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400",
    primary: "text-slate-800 dark:text-slate-200",
  },
  
  // Icon containers
  iconContainer: {
    blue: "bg-blue-500/10 p-3 rounded-xl",
    purple: "bg-purple-500/10 p-3 rounded-xl",
    amber: "bg-amber-500/10 p-3 rounded-xl",
    green: "bg-green-500/10 p-3 rounded-xl",
    indigo: "bg-indigo-500/10 p-3 rounded-xl",
  },
  
  // Status colors
  status: {
    success: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    error: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    info: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  },
  
  // Text styles
  text: {
    muted: "text-slate-600 dark:text-slate-400",
    default: "text-slate-800 dark:text-slate-200",
  },
}; 