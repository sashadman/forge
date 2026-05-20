'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  ReadinessItemStatus,
  ReadinessItemType,
} from '@/lib/supabase/app-types'
import { READINESS_CONFIG } from '@/lib/readiness/readiness-config'

const DOCUMENT_BUCKET = 'seeker-documents'

export type ReadinessItemRow = {
  id: string
  user_id: string
  type: ReadinessItemType
  status: ReadinessItemStatus
  file_path: string | null
  file_name: string | null
  file_size_kb: number | null
  file_mime_type: string | null
  text_content: string | null
  notes: string | null
  verified_by: string | null
  verified_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export type ReadinessScoreRow = {
  user_id: string
  total_items: number
  completed_items: number
  required_total: number
  required_completed: number
  score_pct: number
}

async function getAuthenticatedUserId() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated.')
  }

  return user.id
}

function revalidateReadinessViews() {
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/readiness')
}

async function getCurrentReadinessItem({
  userId,
  type,
}: {
  userId: string
  type: ReadinessItemType
}) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('seeker_readiness_items')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load readiness item: ${error.message}`)
  }

  return (data ?? null) as ReadinessItemRow | null
}

async function upsertReadinessItem({
  userId,
  type,
  status,
  textContent,
  notes,
  filePath,
  fileName,
  fileSizeKb,
  fileMimeType,
}: {
  userId: string
  type: ReadinessItemType
  status: ReadinessItemStatus
  textContent?: string | null
  notes?: string | null
  filePath?: string | null
  fileName?: string | null
  fileSizeKb?: number | null
  fileMimeType?: string | null
}) {
  const supabase = createClient()

  const payload: {
    user_id: string
    type: ReadinessItemType
    status: ReadinessItemStatus
    text_content?: string | null
    notes?: string | null
    file_path?: string | null
    file_name?: string | null
    file_size_kb?: number | null
    file_mime_type?: string | null
  } = {
    user_id: userId,
    type,
    status,
  }

  if (textContent !== undefined) payload.text_content = textContent
  if (notes !== undefined) payload.notes = notes
  if (filePath !== undefined) payload.file_path = filePath
  if (fileName !== undefined) payload.file_name = fileName
  if (fileSizeKb !== undefined) payload.file_size_kb = fileSizeKb
  if (fileMimeType !== undefined) payload.file_mime_type = fileMimeType

  const { data, error } = await supabase
    .from('seeker_readiness_items')
    .upsert(payload, {
      onConflict: 'user_id,type',
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to save readiness item: ${error.message}`)
  }

  revalidateReadinessViews()

  return data as ReadinessItemRow
}

export async function getCurrentUserReadinessItems(): Promise<
  ReadinessItemRow[]
> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('seeker_readiness_items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load readiness items: ${error.message}`)
  }

  return (data ?? []) as ReadinessItemRow[]
}

export async function getCurrentUserReadinessScore(): Promise<
  ReadinessScoreRow | null
> {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('seeker_readiness_scores')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load readiness score: ${error.message}`)
  }

  return (data ?? null) as ReadinessScoreRow | null
}

export async function toggleReadinessCheckbox({
  type,
  checked,
}: {
  type: ReadinessItemType
  checked: boolean
}) {
  const userId = await getAuthenticatedUserId()
return upsertReadinessItem({
  userId,
  type,
  status: 'uploaded',
  textContent: null,
 
})

}

export async function saveReadinessText({
  type,
  textContent,
}: {
  type: ReadinessItemType
  textContent: string
}) {
  const userId = await getAuthenticatedUserId()
  const currentItem = await getCurrentReadinessItem({ userId, type })
  const trimmed = textContent.trim()

  const hasUploadedFile = Boolean(currentItem?.file_path)

  return upsertReadinessItem({
    userId,
    type,
    textContent: trimmed || null,
    status: hasUploadedFile
      ? 'uploaded'
      : trimmed.length > 0
        ? 'complete'
        : 'missing',
  })
}

export async function markExternalReadinessItem({
  type,
  complete,
}: {
  type: ReadinessItemType
  complete: boolean
}) {
  const userId = await getAuthenticatedUserId()

  return upsertReadinessItem({
    userId,
    type,
    status: complete ? 'complete' : 'missing',
  })
}

function sanitizeFileName(fileName: string) {
  const cleanBaseName = fileName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()

  return cleanBaseName || 'document'
}

function validateFileForReadinessItem({
  type,
  fileName,
  fileSizeKb,
  fileMimeType,
}: {
  type: ReadinessItemType
  fileName: string
  fileSizeKb: number
  fileMimeType: string
}) {
  const config = READINESS_CONFIG[type]

  if (config.inputMethod !== 'file_upload') {
    throw new Error('This readiness item does not accept file uploads.')
  }

  const extension = fileName.split('.').pop()?.toLowerCase()

  if (
    config.allowedFormats &&
    (!extension || !config.allowedFormats.includes(extension))
  ) {
    throw new Error(
      `Allowed file types: ${config.allowedFormats.join(', ').toUpperCase()}.`
    )
  }

  if (config.maxSizeMb && fileSizeKb > config.maxSizeMb * 1024) {
    throw new Error(`File must be under ${config.maxSizeMb}MB.`)
  }

  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'text/plain',
  ]

  if (!allowedMimeTypes.includes(fileMimeType)) {
    throw new Error('Unsupported file type.')
  }
}

export async function createReadinessUploadUrl({
  type,
  fileName,
  fileSizeKb,
  fileMimeType,
}: {
  type: ReadinessItemType
  fileName: string
  fileSizeKb: number
  fileMimeType: string
}) {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  validateFileForReadinessItem({
    type,
    fileName,
    fileSizeKb,
    fileMimeType,
  })

  const safeName = sanitizeFileName(fileName)
  const filePath = `${userId}/${type}/${randomUUID()}-${safeName}`

  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUploadUrl(filePath)

  if (error) {
    throw new Error(`Failed to prepare upload: ${error.message}`)
  }

  return {
    signedUrl: data.signedUrl,
    filePath,
  }
}

export async function recordReadinessFileUpload({
  type,
  filePath,
  fileName,
  fileSizeKb,
  fileMimeType,
}: {
  type: ReadinessItemType
  filePath: string
  fileName: string
  fileSizeKb: number
  fileMimeType: string
}) {
  const userId = await getAuthenticatedUserId()

  if (!filePath.startsWith(`${userId}/`)) {
    throw new Error('Invalid file path.')
  }

  validateFileForReadinessItem({
    type,
    fileName,
    fileSizeKb,
    fileMimeType,
  })

  return upsertReadinessItem({
    userId,
    type,
    status: 'uploaded',
    textContent: null,
    filePath,
    fileName,
    fileSizeKb,
    fileMimeType,
  })
}

export async function generateReadinessTextFile({
  type,
  textContent,
}: {
  type: ReadinessItemType
  textContent: string
}) {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const trimmed = textContent.trim()

  if (!trimmed) {
    throw new Error('Add resume text before generating a file.')
  }

  const config = READINESS_CONFIG[type]

  if (config.inputMethod !== 'file_upload') {
    throw new Error('This item cannot generate a document file.')
  }

  const currentItem = await getCurrentReadinessItem({ userId, type })

  if (currentItem?.file_path && currentItem.file_mime_type === 'text/plain') {
    await supabase.storage.from(DOCUMENT_BUCKET).remove([currentItem.file_path])
  }

  const fileName =
    type === 'resume'
      ? 'generated-resume.txt'
      : `${sanitizeFileName(config.label)}.txt`

  const filePath = `${userId}/${type}/${randomUUID()}-${fileName}`

  const fileBody = [
    config.label,
    '',
    'Generated from profile readiness text.',
    `Generated at: ${new Date().toISOString()}`,
    '',
    trimmed,
  ].join('\n')

  const fileSizeKb = Math.max(1, Math.round(Buffer.byteLength(fileBody) / 1024))

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .upload(filePath, fileBody, {
      contentType: 'text/plain',
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Failed to generate resume file: ${uploadError.message}`)
  }

  return upsertReadinessItem({
    userId,
    type,
    status: 'uploaded',
    textContent: trimmed,
    filePath,
    fileName,
    fileSizeKb,
    fileMimeType: 'text/plain',
  })
}

export async function getReadinessFileDownloadUrl({
  filePath,
}: {
  filePath: string
}) {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  if (!filePath.startsWith(`${userId}/`)) {
    throw new Error('Invalid file path.')
  }

  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(filePath, 60 * 10)

  if (error) {
    throw new Error(`Failed to open file: ${error.message}`)
  }

  return data.signedUrl
}

export async function removeReadinessFile({
  type,
}: {
  type: ReadinessItemType
}) {
  const supabase = createClient()
  const userId = await getAuthenticatedUserId()

  const currentItem = await getCurrentReadinessItem({ userId, type })

  if (currentItem?.file_path) {
    const { error: removeError } = await supabase.storage
      .from(DOCUMENT_BUCKET)
      .remove([currentItem.file_path])

    if (removeError) {
      throw new Error(`Failed to remove file: ${removeError.message}`)
    }
  }

  const hasTextFallback = Boolean(currentItem?.text_content?.trim())

  return upsertReadinessItem({
    userId,
    type,
    status: hasTextFallback ? 'complete' : 'missing',
    filePath: null,
    fileName: null,
    fileSizeKb: null,
    fileMimeType: null,
  })
}