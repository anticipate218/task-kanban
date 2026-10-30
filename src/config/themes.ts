export const themes = [
  {
    id: 'light',
    name: '亮色',
    description: '清爽白净，白天高效办公',
    swatch: ['#f4f6fb', '#5b8def', '#1f2937'],
    colors: {
      bg: '#f4f6fb',
      'bg-soft': '#e9edf5',
      surface: '#ffffff',
      'surface-hover': '#f8fafd',
      border: '#e2e8f0',
      text: '#1f2937',
      'text-secondary': '#6b7280',
      'text-muted': '#9ca3af',
      primary: '#5b8def',
      'primary-hover': '#4a7de0',
      'primary-soft': 'rgba(91, 141, 239, 0.12)',
      'primary-contrast': '#ffffff',
      success: '#4ecb8f',
      danger: '#ef5b6e',
      star: '#f5b840',
      urgent: '#ef5b6e',
      'shadow-sm': '0 1px 3px rgba(16, 24, 40, 0.08)',
      'shadow-md': '0 4px 16px rgba(16, 24, 40, 0.12)'
    }
  },
  {
    id: 'dark',
    name: '暗色',
    description: '深夜守护，加班也有氛围感',
    swatch: ['#111827', '#6d9bf1', '#e5e9f0'],
    colors: {
      bg: '#0f1523',
      'bg-soft': '#1a2233',
      surface: '#1e2637',
      'surface-hover': '#273046',
      border: '#2e3850',
      text: '#e5e9f0',
      'text-secondary': '#a8b3c5',
      'text-muted': '#6e7a90',
      primary: '#6d9bf1',
      'primary-hover': '#8ab0f5',
      'primary-soft': 'rgba(109, 155, 241, 0.16)',
      'primary-contrast': '#0d1424',
      success: '#4ecb8f',
      danger: '#f47182',
      star: '#f5c453',
      urgent: '#f47182',
      'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
      'shadow-md': '0 4px 16px rgba(0, 0, 0, 0.5)'
    }
  },
  {
    id: 'colorful',
    name: '多彩',
    description: '渐变糖果色，灵感源源不断',
    swatch: ['#fbd3e9', '#b45de0', '#26c6a6'],
    colors: {
      bg: 'linear-gradient(135deg, #fce4ec 0%, #ede7f6 45%, #e0f7fa 100%)',
      'bg-soft': 'rgba(255, 255, 255, 0.55)',
      surface: 'rgba(255, 255, 255, 0.88)',
      'surface-hover': 'rgba(255, 255, 255, 0.98)',
      border: 'rgba(180, 93, 224, 0.22)',
      text: '#3a2d4d',
      'text-secondary': '#6f5f8a',
      'text-muted': '#a294b8',
      primary: '#b45de0',
      'primary-hover': '#9e4fd0',
      'primary-soft': 'rgba(180, 93, 224, 0.14)',
      'primary-contrast': '#ffffff',
      success: '#26c6a6',
      danger: '#f06292',
      star: '#f5a623',
      urgent: '#f06292',
      'shadow-sm': '0 1px 3px rgba(120, 60, 160, 0.12)',
      'shadow-md': '0 4px 16px rgba(120, 60, 160, 0.18)'
    }
  }
]

export function getThemeById(id) {
  return themes.find((t) => t.id === id)
}