'use client'

import dynamic from 'next/dynamic'
import { Attraction } from '@/types'

const InteractiveMap = dynamic(() => import('./InteractiveMap'), { ssr: false })

export default function MapWrapper({ attractions }: { attractions: Attraction[] }) {
  return <InteractiveMap attractions={attractions} />
}
