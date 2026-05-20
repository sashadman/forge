'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Info,
  Loader2,
  Square,
  Trash2,
  Upload,
} from 'lucide-react'
import type { ReadinessItemRow as ReadinessItemRowData } from '@/app/actions/readiness'
import {
  createReadinessUploadUrl,
  generateReadinessTextFile,
  getReadinessFileDownloadUrl,
  markExternalReadinessItem,
  recordReadinessFileUpload,
  removeReadinessFile,
  saveReadinessText,
  toggleReadinessCheckbox,
} from '@/app/actions/readiness'
import type { ReadinessItemConfig } from '@/lib/readiness/readiness-config'
import {
  getReadinessStatusLabel,
  isReadinessItemComplete,
} from '@/lib/readiness/readiness-config'

type ReadinessItemRowProps = {
  config: ReadinessItemConfig
  item: ReadinessItemRowData | null
  onUpdated: (item: ReadinessItemRowData) => void
}

const WORD_MIME_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function getStatusIcon(status: ReadinessItemRowData['status']) {
  if (status === 'verified') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
  }

  if (status === 'uploaded' || status === 'complete') {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />
  }

  if (status === 'in_progress') {
    return <Clock className="h-4 w-4 text-orange-600" />
  }

  return <AlertCircle className="h-4 w-4 text-slate-400" />
}

function getStatusBadgeClass(status: ReadinessItemRowData['status']) {
  if (status === 'verified') {
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  }

  if (status === 'uploaded' || status === 'complete') {
    return 'bg-green-50 text-green-700 ring-1 ring-green-200'
  }

  if (status === 'in_progress') {
    return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  }

  return 'bg-slate-100 text-slate-600'
}

function formatFileSize(fileSizeKb: number | null) {
  if (!fileSizeKb) return 'File size unavailable'

  if (fileSizeKb < 1024) {
    return `${fileSizeKb} KB`
  }

  return `${(fileSizeKb / 1024).toFixed(1)} MB`
}

function getAcceptedFileTypes(config: ReadinessItemConfig) {
  return config.allowedFormats?.map((format) => `.${format}`).join(',')
}

function isWordDocument(mimeType: string | null | undefined) {
  return Boolean(mimeType && WORD_MIME_TYPES.includes(mimeType))
}

export default function ReadinessItemRow({
  config,
  item,
  onUpdated,
}: ReadinessItemRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [expanded, setExpanded] = useState(
    config.isRequired && item?.status === 'missing'
  )
  const [showInfo, setShowInfo] = useState(false)
  const [textValue, setTextValue] = useState(item?.text_content ?? '')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  const status = item?.status ?? 'missing'
  const complete = isReadinessItemComplete(status)
  const hasFile = Boolean(item?.file_path)
  const hasText = Boolean(textValue.trim())
  const isGeneratedTextFile = item?.file_mime_type === 'text/plain'
  const isUploadedDocument = hasFile && !isGeneratedTextFile
  const canExpand =
    config.inputMethod === 'file_upload' ||
    config.inputMethod === 'text_editor'

  useEffect(() => {
    setTextValue(item?.text_content ?? '')
  }, [item?.text_content])

  function resetMessages() {
    setError('')
    setSuccess('')
  }

  function handleCheckboxToggle() {
    resetMessages()

    startTransition(async () => {
      try {
        const updated = await toggleReadinessCheckbox({
          type: config.type,
          checked: !complete,
        })

        onUpdated(updated)
        setSuccess(!complete ? 'Marked complete.' : 'Marked incomplete.')
      } catch (error) {
        console.error('Failed to update readiness checkbox:', error)
        setError('Could not update this item.')
      }
    })
  }

  function handleExternalToggle() {
    resetMessages()

    startTransition(async () => {
      try {
        const updated = await markExternalReadinessItem({
          type: config.type,
          complete: !complete,
        })

        onUpdated(updated)
        setSuccess(!complete ? 'Marked complete.' : 'Marked incomplete.')
      } catch (error) {
        console.error('Failed to update external readiness item:', error)
        setError('Could not update this item.')
      }
    })
  }

  function handleTextSave() {
    resetMessages()

    startTransition(async () => {
      try {
        const updated =
          config.inputMethod === 'file_upload'
            ? await generateReadinessTextFile({
                type: config.type,
                textContent: textValue,
              })
            : await saveReadinessText({
                type: config.type,
                textContent: textValue,
              })

        onUpdated(updated)

        setSuccess(
          config.inputMethod === 'file_upload'
            ? 'Resume text saved as a private file.'
            : textValue.trim()
              ? 'Saved successfully.'
              : 'Text cleared.'
        )
      } catch (error) {
        console.error('Failed to save readiness text:', error)
        setError(
          error instanceof Error ? error.message : 'Could not save this item.'
        )
      }
    })
  }

  function validateFileBeforeUpload(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase()

    if (
      config.allowedFormats &&
      (!extension || !config.allowedFormats.includes(extension))
    ) {
      throw new Error(
        `Allowed file types: ${config.allowedFormats
          .join(', ')
          .toUpperCase()}.`
      )
    }

    if (config.maxSizeMb && file.size > config.maxSizeMb * 1024 * 1024) {
      throw new Error(`File must be under ${config.maxSizeMb}MB.`)
    }
  }

  async function uploadFile(file: File) {
    validateFileBeforeUpload(file)

    const fileSizeKb = Math.max(1, Math.round(file.size / 1024))
    const fileMimeType = file.type || 'application/octet-stream'

    const { signedUrl, filePath } = await createReadinessUploadUrl({
      type: config.type,
      fileName: file.name,
      fileSizeKb,
      fileMimeType,
    })

    const uploadResponse = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': fileMimeType,
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Upload failed. Please try again.')
    }

    return recordReadinessFileUpload({
      type: config.type,
      filePath,
      fileName: file.name,
      fileSizeKb,
      fileMimeType,
    })
  }

  function handleFileSelected(file: File | undefined) {
    if (!file) return

    resetMessages()

    startTransition(async () => {
      try {
        const updated = await uploadFile(file)

        onUpdated(updated)
        setSuccess('File uploaded successfully.')
      } catch (error) {
        console.error('Failed to upload readiness file:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Could not upload this file.'
        )
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    })
  }

  function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)

    const file = event.dataTransfer.files[0]
    handleFileSelected(file)
  }

  function handleViewFile() {
    if (!item?.file_path) return

    resetMessages()

    const fileWindow = window.open('', '_blank')

    if (!fileWindow) {
      setError(
        'Your browser blocked the file window. Please allow popups for this site.'
      )
      return
    }

    fileWindow.document.write(
      '<p style="font-family: system-ui; padding: 24px;">Opening secure file...</p>'
    )

    startTransition(async () => {
      try {
        const downloadUrl = await getReadinessFileDownloadUrl({
          filePath: item.file_path as string,
        })

        fileWindow.location.href = downloadUrl
      } catch (error) {
        console.error('Failed to open readiness file:', error)
        fileWindow.close()
        setError('Could not open this file.')
      }
    })
  }

  function handleRemoveFile() {
    resetMessages()

    startTransition(async () => {
      try {
        const updated = await removeReadinessFile({
          type: config.type,
        })

        onUpdated(updated)
        setSuccess('File removed.')
      } catch (error) {
        console.error('Failed to remove readiness file:', error)
        setError('Could not remove this file.')
      }
    })
  }

  return (
    <div
      className={`overflow-hidden rounded-3xl border transition ${
        complete
          ? 'border-green-100 bg-green-50/40'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
            ) : (
              getStatusIcon(status)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-950">
                {config.label}
              </h3>

              {config.isRequired && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                  Required
                </span>
              )}

              {config.isSensitive && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  Private
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeClass(
                  status
                )}`}
              >
                {getReadinessStatusLabel(status)}
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {config.description}
            </p>

            {hasFile && (
              <div className="mt-3 flex max-w-full flex-wrap items-center gap-2">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                  <span className="truncate">{item?.file_name}</span>
                </span>

                {isWordDocument(item?.file_mime_type) && (
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                    Word files download instead of previewing
                  </span>
                )}

                {isGeneratedTextFile && (
                  <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                    Generated from pasted text
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setShowInfo((current) => !current)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Why this matters"
            >
              <Info className="h-4 w-4" />
            </button>

            {canExpand && (
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label={expanded ? 'Collapse item' : 'Expand item'}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}

            {config.inputMethod === 'checkbox' && (
              <button
                type="button"
                onClick={handleCheckboxToggle}
                disabled={isPending}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
              >
                {complete ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
            )}

            {config.inputMethod === 'external' && (
              <button
                type="button"
                onClick={handleExternalToggle}
                disabled={isPending}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
              >
                {complete ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <ExternalLink className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {showInfo && (
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm leading-6 text-blue-800">
              <span className="font-semibold">Why this matters: </span>
              {config.whyItMatters}
            </p>
          </div>
        )}

        {success && (
          <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
            {success}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        )}
      </div>

      {expanded && config.inputMethod === 'file_upload' && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          <div
            className={`grid gap-5 ${
              isUploadedDocument ? 'lg:grid-cols-1' : 'lg:grid-cols-[1fr_1fr]'
            }`}
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Upload file
                  </p>

                  <h4 className="mt-2 text-xl font-bold text-slate-950">
                    Resume document
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Upload a PDF, Word document, image, or generated text file.
                    PDF files usually preview in the browser. Word documents
                    usually download.
                  </p>
                </div>

                <Upload className="h-6 w-6 shrink-0 text-orange-600" />
              </div>

              {hasFile && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-1 h-5 w-5 shrink-0 text-orange-600" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-950">
                        {item?.file_name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatFileSize(item?.file_size_kb ?? null)}
                      </p>

                      {isWordDocument(item?.file_mime_type) && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Word files cannot reliably preview in the browser.
                          This button will download the file.
                        </p>
                      )}

                      {isUploadedDocument && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          This uploaded file is your active resume source. To
                          use pasted text instead, remove this file first.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleViewFile}
                      disabled={isPending}
                      className="btn-outline px-4 py-2 text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      {isWordDocument(item?.file_mime_type)
                        ? 'Download file'
                        : 'Open file'}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={isPending}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    fileInputRef.current?.click()
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
                className={`mt-5 cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center transition ${
                  dragging
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-slate-300 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                {isPending ? (
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
                ) : (
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                )}

                <p className="mt-3 font-semibold text-slate-950">
                  {hasFile ? 'Replace file' : 'Choose file or drag it here'}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {config.allowedFormats?.join(', ').toUpperCase()} up to{' '}
                  {config.maxSizeMb}MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={getAcceptedFileTypes(config)}
                  onChange={(event) =>
                    handleFileSelected(event.target.files?.[0])
                  }
                />
              </div>
            </div>

            {!isUploadedDocument && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Text fallback
                </p>

                <h4 className="mt-2 text-xl font-bold text-slate-950">
                  Generate resume file from text
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If you do not have a PDF or Word resume ready, paste your
                  resume text here. The system will generate a private text
                  resume file from it.
                </p>

                <textarea
                  value={textValue}
                  onChange={(event) => setTextValue(event.target.value)}
                  rows={10}
                  className="input-field mt-5"
                  placeholder={
                    config.placeholder ||
                    'Paste your resume text, work history, skills, tools, and certifications here.'
                  }
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    {textValue.length} characters
                  </p>

                  <button
                    type="button"
                    onClick={handleTextSave}
                    disabled={isPending}
                    className="btn-primary px-5 py-2 text-sm"
                  >
                    {isPending
                      ? 'Generating...'
                      : hasFile
                        ? 'Update generated resume file'
                        : 'Generate resume file'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {expanded && config.inputMethod === 'text_editor' && (
        <div className="border-t border-slate-200 bg-slate-50 p-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <textarea
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              rows={8}
              className="input-field"
              placeholder={config.placeholder}
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                {textValue.length} characters
              </p>

              <button
                type="button"
                onClick={handleTextSave}
                disabled={isPending}
                className="btn-primary px-5 py-2 text-sm"
              >
                {isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}