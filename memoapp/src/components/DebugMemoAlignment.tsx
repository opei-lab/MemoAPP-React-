import { COLOR_OPTIONS } from '../constants'
import { MemoContent } from './MemoCard/MemoContent'

export const DebugMemoAlignment = () => {
  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">メモタイトル中央揃えテスト</h2>
      <div className="grid grid-cols-3 gap-6">
        {COLOR_OPTIONS.map((color) => (
          <div 
            key={color.name}
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: color.value }}
          >
            <div className="mb-2 text-sm font-bold">{color.label}</div>
            <div className="bg-white/80 p-4 rounded">
              <MemoContent 
                title={`${color.label}のテストタイトル`}
                content="これはテストコンテンツです。中央揃えが正しく機能しているか確認します。"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* 親要素のフレックスボックスの影響をテスト */}
      <h3 className="text-xl font-bold mt-8 mb-4">親要素フレックスボックステスト</h3>
      <div className="grid grid-cols-3 gap-6">
        {COLOR_OPTIONS.map((color) => (
          <div 
            key={color.name}
            className="p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: color.value }}
          >
            <div className="mb-2 text-sm font-bold">{color.label} (flex親要素)</div>
            <div className="bg-white/80 p-4 rounded flex flex-col">
              <MemoContent 
                title={`${color.label}のテストタイトル`}
                content="これはテストコンテンツです。中央揃えが正しく機能しているか確認します。"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}