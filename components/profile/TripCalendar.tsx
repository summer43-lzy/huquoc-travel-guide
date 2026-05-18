'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Attraction } from '@/types'
import { tripData } from '@/data/itinerary'
import { GripVertical, X, MapPin } from 'lucide-react'
import CategoryBadge from '@/components/ui/CategoryBadge'

interface ScheduledItem {
  attraction: Attraction
  id: string
}

interface DaySchedule {
  date: string
  label: string
  items: ScheduledItem[]
}

interface Props {
  favorites: Attraction[]
}

export default function TripCalendar({ favorites }: Props) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    tripData.days.map(d => ({
      date: d.date,
      label: `Day ${d.day} · ${d.title.split('·')[0].trim()}`,
      items: [],
    }))
  )
  const [unscheduled, setUnscheduled] = useState<ScheduledItem[]>(
    favorites.map(f => ({ attraction: f, id: `unscheduled-${f.id}` }))
  )

  function onDragEnd(result: DropResult) {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceIsUnscheduled = source.droppableId === 'unscheduled'
    const destIsUnscheduled = destination.droppableId === 'unscheduled'

    const getList = (id: string): ScheduledItem[] =>
      id === 'unscheduled'
        ? [...unscheduled]
        : [...(schedule.find(d => d.date === id)?.items ?? [])]

    const setList = (id: string, items: ScheduledItem[]) => {
      if (id === 'unscheduled') {
        setUnscheduled(items)
      } else {
        setSchedule(prev => prev.map(d => d.date === id ? { ...d, items } : d))
      }
    }

    if (source.droppableId === destination.droppableId) {
      const list = getList(source.droppableId)
      const [removed] = list.splice(source.index, 1)
      list.splice(destination.index, 0, removed)
      setList(source.droppableId, list)
    } else {
      const sourceList = getList(source.droppableId)
      const destList = getList(destination.droppableId)
      const [removed] = sourceList.splice(source.index, 1)
      destList.splice(destination.index, 0, removed)
      setList(source.droppableId, sourceList)
      setList(destination.droppableId, destList)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {/* Unscheduled favorites */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-ocean-500" />
            待安排收藏
            <span className="ml-auto text-xs bg-ocean-100 text-ocean-700 px-2 py-0.5 rounded-full">{unscheduled.length}</span>
          </h3>
          <Droppable droppableId="unscheduled">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-32 rounded-2xl border-2 border-dashed p-3 space-y-2 transition-colors ${
                  snapshot.isDraggingOver ? 'border-ocean-400 bg-ocean-50' : 'border-stone-200 bg-stone-50'
                }`}
              >
                {unscheduled.length === 0 && !snapshot.isDraggingOver && (
                  <p className="text-center text-stone-400 text-sm py-6">所有收藏均已排入日程</p>
                )}
                {unscheduled.map((item, index) => (
                  <DraggableCard key={item.id} item={item} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Day columns */}
        <div className="lg:col-span-4 space-y-3">
          {schedule.map(day => (
            <div key={day.date}>
              <h3 className="font-semibold text-stone-700 mb-2 text-sm">{day.label}</h3>
              <Droppable droppableId={day.date} direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex gap-2 min-h-16 rounded-xl border-2 border-dashed p-2 overflow-x-auto transition-colors ${
                      snapshot.isDraggingOver ? 'border-ocean-400 bg-ocean-50' : 'border-stone-100 bg-white'
                    }`}
                  >
                    {day.items.length === 0 && !snapshot.isDraggingOver && (
                      <p className="text-stone-300 text-xs self-center px-2">拖拽行程到此</p>
                    )}
                    {day.items.map((item, index) => (
                      <DraggableCard key={item.id} item={item} index={index} compact />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  )
}

function DraggableCard({ item, index, compact = false }: { item: ScheduledItem; index: number; compact?: boolean }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`flex-shrink-0 bg-white border rounded-xl overflow-hidden shadow-sm select-none transition-shadow ${
            snapshot.isDragging ? 'shadow-xl border-ocean-300 rotate-1' : 'border-stone-100'
          } ${compact ? 'w-36' : 'w-full'}`}
        >
          {!compact && (
            <div className="relative h-24 overflow-hidden">
              <img src={item.attraction.image} alt={item.attraction.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 image-overlay" />
            </div>
          )}
          <div className={`flex items-start gap-1.5 ${compact ? 'p-2' : 'p-2.5'}`}>
            <div {...provided.dragHandleProps} className="mt-0.5 text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing flex-shrink-0">
              <GripVertical className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-700 line-clamp-2 leading-tight">{item.attraction.name}</p>
              <div className="mt-1">
                <CategoryBadge category={item.attraction.category} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
