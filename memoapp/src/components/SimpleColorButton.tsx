interface SimpleColorButtonProps {
  color: string
  isSelected: boolean
  onClick: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  title?: string
}

export const SimpleColorButton = ({ color, isSelected, onClick, size = 'md', title }: SimpleColorButtonProps) => {
  const sizes = {
    xs: { width: '32px', height: '32px' },
    sm: { width: '64px', height: '64px' },
    md: { width: '56px', height: '56px' },
    lg: { width: '100px', height: '100px' }
  }
  
  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        width: sizes[size].width,
        height: sizes[size].height,
        backgroundColor: color,
        border: isSelected ? '4px solid #3B82F6' : '3px solid #ffffff',
        borderRadius: '16px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: isSelected 
          ? '0 0 0 3px #ffffff, 0 0 0 6px #3B82F6'
          : '0 2px 8px rgba(0,0,0,0.25)',
        // SVG環境でも確実に表示されるようにする
        display: 'inline-block',
        verticalAlign: 'top'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <span style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: '16px' }}>✓</span>
        </div>
      )}
    </div>
  )
}