'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import ShareModal from './ShareModal'

interface Props {
  className?: string
  label?: string
}

export default function ShareButton({ className, label = '邀请朋友' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={className}
        aria-label="分享"
      >
        <Share2 className="w-4 h-4" />
        {label}
      </button>
      {open && <ShareModal onClose={() => setOpen(false)} />}
    </>
  )
}
