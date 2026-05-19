import { createClient } from '@/lib/supabase/client'

// ── Favorites ─────────────────────────────────────────────────────────────────

export async function getFavorites(userId: string) {
  const sb = createClient()
  const { data } = await sb.from('favorites').select('content_type, content_id').eq('user_id', userId)
  return data ?? []
}

export async function isFavoriteDb(userId: string, contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('favorites').select('id')
    .eq('user_id', userId).eq('content_type', contentType).eq('content_id', contentId).maybeSingle()
  return !!data
}

export async function toggleFavoriteDb(userId: string, contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('favorites').select('id')
    .eq('user_id', userId).eq('content_type', contentType).eq('content_id', contentId).maybeSingle()
  if (data) {
    await sb.from('favorites').delete().eq('id', data.id)
    return false
  }
  await sb.from('favorites').insert({ user_id: userId, content_type: contentType, content_id: contentId })
  return true
}

// ── Ratings ───────────────────────────────────────────────────────────────────

export async function getUserRating(userId: string, contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('ratings').select('score')
    .eq('user_id', userId).eq('content_type', contentType).eq('content_id', contentId).maybeSingle()
  return data?.score ?? null
}

export async function setRatingDb(userId: string, contentType: string, contentId: string, score: number) {
  const sb = createClient()
  await sb.from('ratings').upsert(
    { user_id: userId, content_type: contentType, content_id: contentId, score, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,content_type,content_id' }
  )
}

export async function getAggregateRating(contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('ratings').select('score')
    .eq('content_type', contentType).eq('content_id', contentId)
  if (!data || data.length === 0) return { avg: 0, count: 0 }
  const avg = data.reduce((s, r) => s + r.score, 0) / data.length
  return { avg: Math.round(avg * 10) / 10, count: data.length }
}

// ── Comments ──────────────────────────────────────────────────────────────────

export interface Comment {
  id: string
  user_id: string
  content_type: string
  content_id: string
  body: string
  approved: boolean
  created_at: string
  display_name?: string
}

export async function getComments(contentType: string, contentId: string): Promise<Comment[]> {
  const sb = createClient()
  const { data } = await sb.from('comments').select('*')
    .eq('content_type', contentType).eq('content_id', contentId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as Comment[]
}

export async function submitComment(userId: string, contentType: string, contentId: string, body: string) {
  const sb = createClient()
  const { error } = await sb.from('comments').insert({ user_id: userId, content_type: contentType, content_id: contentId, body })
  return !error
}

export async function getPendingComments() {
  const sb = createClient()
  const { data } = await sb.from('comments').select('*').eq('approved', false).order('created_at', { ascending: true })
  return (data ?? []) as Comment[]
}

export async function approveComment(id: string) {
  const sb = createClient()
  await sb.from('comments').update({ approved: true }).eq('id', id)
}

export async function deleteComment(id: string) {
  const sb = createClient()
  await sb.from('comments').delete().eq('id', id)
}

// ── Journals ──────────────────────────────────────────────────────────────────

export interface Journal {
  id: string
  user_id: string
  title: string
  body: string
  is_public: boolean
  cover_url: string | null
  related_content_type: string | null
  related_content_id: string | null
  created_at: string
  updated_at: string
}

export async function getUserJournals(userId: string): Promise<Journal[]> {
  const sb = createClient()
  const { data } = await sb.from('journals').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return (data ?? []) as Journal[]
}

export async function getPublicJournals(): Promise<Journal[]> {
  const sb = createClient()
  const { data } = await sb.from('journals').select('*').eq('is_public', true).order('created_at', { ascending: false })
  return (data ?? []) as Journal[]
}

export async function createJournal(
  userId: string, title: string, body: string, isPublic: boolean,
  coverUrl?: string, relatedContentType?: string, relatedContentId?: string
) {
  const sb = createClient()
  const { data, error } = await sb.from('journals').insert({
    user_id: userId, title, body, is_public: isPublic, cover_url: coverUrl ?? null,
    related_content_type: relatedContentType ?? null,
    related_content_id: relatedContentId ?? null,
  }).select().single()
  if (error) return null
  return data as Journal
}

export async function updateJournal(
  id: string, title: string, body: string, isPublic: boolean,
  coverUrl?: string, relatedContentType?: string, relatedContentId?: string
) {
  const sb = createClient()
  await sb.from('journals').update({
    title, body, is_public: isPublic, cover_url: coverUrl ?? null,
    related_content_type: relatedContentType ?? null,
    related_content_id: relatedContentId ?? null,
    updated_at: new Date().toISOString()
  }).eq('id', id)
}

export async function getPublicJournalsForContent(contentType: string, contentId: string): Promise<Journal[]> {
  const sb = createClient()
  const { data } = await sb.from('journals').select('*')
    .eq('is_public', true)
    .eq('related_content_type', contentType)
    .eq('related_content_id', contentId)
    .order('created_at', { ascending: false })
  return (data ?? []) as Journal[]
}

export async function deleteJournal(id: string) {
  const sb = createClient()
  await sb.from('journals').delete().eq('id', id)
}

// ── Footprints ────────────────────────────────────────────────────────────────

export interface Footprint {
  id: string
  content_type: string
  content_id: string
  visited_at: string
}

export async function getFootprints(userId: string): Promise<Footprint[]> {
  const sb = createClient()
  const { data } = await sb.from('footprints').select('*').eq('user_id', userId).order('visited_at', { ascending: false })
  return (data ?? []) as Footprint[]
}

export async function toggleFootprint(userId: string, contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('footprints').select('id')
    .eq('user_id', userId).eq('content_type', contentType).eq('content_id', contentId).maybeSingle()
  if (data) {
    await sb.from('footprints').delete().eq('id', data.id)
    return false
  }
  await sb.from('footprints').insert({ user_id: userId, content_type: contentType, content_id: contentId })
  return true
}

export async function hasFootprint(userId: string, contentType: string, contentId: string) {
  const sb = createClient()
  const { data } = await sb.from('footprints').select('id')
    .eq('user_id', userId).eq('content_type', contentType).eq('content_id', contentId).maybeSingle()
  return !!data
}

// ── Photos ────────────────────────────────────────────────────────────────────

export interface Photo {
  id: string
  user_id: string
  url: string
  caption: string | null
  day: number | null
  is_public: boolean
  created_at: string
}

export async function addPublicPhoto(userId: string, url: string, caption: string, day: number) {
  const sb = createClient()
  const { data, error } = await sb.from('photos').insert({
    user_id: userId, url, caption: caption || null, day, is_public: true,
  }).select().single()
  if (error) return null
  return data as Photo
}

export async function getPublicPhotos(): Promise<Photo[]> {
  const sb = createClient()
  const { data } = await sb.from('photos').select('*').eq('is_public', true).order('created_at', { ascending: false })
  return (data ?? []) as Photo[]
}

export async function togglePhotoLike(userId: string, photoId: string): Promise<boolean> {
  const sb = createClient()
  const { data } = await sb.from('photo_likes').select('id').eq('user_id', userId).eq('photo_id', photoId).maybeSingle()
  if (data) {
    await sb.from('photo_likes').delete().eq('id', data.id)
    return false
  }
  await sb.from('photo_likes').insert({ user_id: userId, photo_id: photoId })
  return true
}

export async function getPhotoLikeCounts(photoIds: string[]): Promise<Record<string, number>> {
  if (photoIds.length === 0) return {}
  const sb = createClient()
  const { data } = await sb.from('photo_likes').select('photo_id').in('photo_id', photoIds)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.photo_id] = (counts[row.photo_id] ?? 0) + 1
  }
  return counts
}

export async function getUserLikedPhotos(userId: string, photoIds: string[]): Promise<Set<string>> {
  if (photoIds.length === 0) return new Set()
  const sb = createClient()
  const { data } = await sb.from('photo_likes').select('photo_id').eq('user_id', userId).in('photo_id', photoIds)
  return new Set((data ?? []).map((r: any) => r.photo_id))
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getUserStats(userId: string) {
  const sb = createClient()
  const [favRes, journalRes, footprintRes, likesRes] = await Promise.all([
    sb.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('journals').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('footprints').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('journals').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_public', true),
  ])
  return {
    favorites: favRes.count ?? 0,
    journals: journalRes.count ?? 0,
    footprints: footprintRes.count ?? 0,
    publicJournals: likesRes.count ?? 0,
  }
}
