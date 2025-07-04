import { COLOR_BUTTON_SIZES, COLOR_BUTTON_STYLES } from '../constants/styles'

interface SimpleColorButtonProps {
  color: string
  isSelected: boolean
  onClick: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  title?: string
}

export const SimpleColorButton = ({ color, isSelected, onClick, size = 'md', title }: SimpleColorButtonProps) => {
  const sizeStyle = COLOR_BUTTON_SIZES[size]
  
  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        ...sizeStyle,
        backgroundColor: color,
        ...COLOR_BUTTON_STYLES.base,
        ...(isSelected ? COLOR_BUTTON_STYLES.selected : COLOR_BUTTON_STYLES.unselected)
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {isSelected && (
        <div style={COLOR_BUTTON_STYLES.checkmark}>
          <span style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
        </div>
      )}
    </div>
  )
}