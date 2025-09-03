import { useEffect, useLayoutEffect, useMemo, useState } from 'react'

function getRectForSelector(selector) {
  if (!selector) return null
  const el = document.querySelector(selector)
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return { el, rect }
}

function choosePlacement(rect, vw, vh) {
  // Prefer bottom, then top, right, left
  if (rect.bottom + 140 < vh) return 'bottom'
  if (rect.top - 140 > 0) return 'top'
  if (rect.right + 280 < vw) return 'right'
  return 'left'
}

export default function Tour({ steps = [], onClose }) {
  const [index, setIndex] = useState(0)
  const [pos, setPos] = useState(null)
  const current = steps[index]

  const selector = current?.selector
  const { el, rect } = useMemo(() => getRectForSelector(selector) || {}, [selector, index])

  const [placement, setPlacement] = useState('bottom')

  useLayoutEffect(() => {
    const update = () => {
      const info = getRectForSelector(selector)
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (!info) {
        setPos(null)
        return
      }
      const plc = choosePlacement(info.rect, vw, vh)
      setPlacement(plc)
      // Compute tooltip position relative to viewport
      const padding = 10
      let top = info.rect.bottom + padding
      let left = Math.max(16, Math.min(vw - 320, info.rect.left))
      if (plc === 'top') {
        top = info.rect.top - 120 - padding
      } else if (plc === 'right') {
        top = info.rect.top
        left = info.rect.right + padding
      } else if (plc === 'left') {
        top = info.rect.top
        left = Math.max(16, info.rect.left - 280 - padding)
      }
      setPos({
        highlight: {
          top: info.rect.top + window.scrollY - 6,
          left: info.rect.left + window.scrollX - 6,
          width: info.rect.width + 12,
          height: info.rect.height + 12,
        },
        tooltip: { top: top + window.scrollY, left: left + window.scrollX }
      })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [selector])

  if (!current) return null

  const safeTitle = current.title || 'Step'
  const safeText = current.text || ''

  const goNext = () => {
    if (index < steps.length - 1) setIndex(index + 1)
    else onClose && onClose()
  }
  const goPrev = () => setIndex(Math.max(0, index - 1))

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Dim overlay */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      {/* Highlight box */}
      {pos?.highlight && (
        <div
          className="pointer-events-none fixed border-2 border-yellow-300 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] animate-pulse"
          style={{
            top: pos.highlight.top,
            left: pos.highlight.left,
            width: pos.highlight.width,
            height: pos.highlight.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)'
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed bg-white rounded-lg shadow-2xl p-4 w-[260px] border"
        style={{ top: pos?.tooltip?.top ?? window.scrollY + 80, left: pos?.tooltip?.left ?? window.scrollX + 40 }}
      >
        <div className="text-sm font-bold mb-1">{safeTitle}</div>
        <div className="text-sm text-gray-700 mb-3">{safeText}</div>
        <div className="flex items-center justify-between text-sm">
          <button onClick={onClose} className="px-2 py-1 bg-gray-100 rounded">Skip</button>
          <div className="flex gap-2">
            <button onClick={goPrev} disabled={index===0} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Back</button>
            <button onClick={goNext} className="px-2 py-1 bg-blue-600 text-white rounded">{index===steps.length-1 ? 'Finish' : 'Next'}</button>
          </div>
        </div>
        {/* Arrow */}
        <div className={`absolute w-0 h-0 border-transparent border-8 ${placement==='bottom' ? 'border-b-white -top-4 left-4 border-b-8' : ''} ${placement==='top' ? 'border-t-white -bottom-4 left-4 border-t-8' : ''} ${placement==='right' ? 'border-r-white left-[-16px] top-4 border-r-8' : ''} ${placement==='left' ? 'border-l-white -right-4 top-4 border-l-8' : ''}`} />
      </div>
    </div>
  )
}
