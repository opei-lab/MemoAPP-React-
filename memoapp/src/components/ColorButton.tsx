interface ColorButtonProps {
  color: string
  isSelected: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
  title?: string
}

const sizeClasses = {
  sm: 'w-20 h-20',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  lg: 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36'
}

export const ColorButton = ({ color, isSelected, onClick, size = 'md', title }: ColorButtonProps) => {
  return (
    <div
      className={`memo-color-button relative ${sizeClasses[size]} rounded-2xl cursor-pointer transition-all hover:scale-105`}
      onClick={onClick}
      title={title}
      data-color-button="true"
      style={{
        '--bg-color': color,
        backgroundColor: color,
        border: isSelected ? '4px solid #3B82F6' : '3px solid white',
        boxShadow: isSelected 
          ? '0 0 0 3px white, 0 0 0 6px #3B82F6'
          : '0 4px 15px rgba(0,0,0,0.15)',
        backgroundImage: 'none',
        backgroundSize: 'auto',
        backgroundAttachment: 'initial',
      } as React.CSSProperties}
    >
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">✓</span>
          </div>
        </div>
      )}
    </div>
  )
}