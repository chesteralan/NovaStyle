import { useState, type ReactNode } from 'react'

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: ReactNode
  headerClass?: string
  titleClass?: string
  contentClass?: string
}

export function Accordion({
  title,
  defaultOpen,
  children,
  headerClass = 'w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50',
  titleClass = 'text-xs font-semibold text-slate-500 uppercase tracking-wider',
  contentClass = 'border-t border-slate-100 p-3',
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        className={headerClass}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className={titleClass}>{title}</span>
        <span className="text-slate-400 text-xs select-none">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className={contentClass}>{children}</div>}
    </div>
  )
}