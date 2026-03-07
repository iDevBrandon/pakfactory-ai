// File validation utilities

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': {
    extensions: ['.pdf'],
    name: 'PDF'
  },
  'application/msword': {
    extensions: ['.doc'],
    name: 'Word Document'
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    extensions: ['.docx'],
    name: 'Word Document'
  },
  'text/markdown': {
    extensions: ['.md', '.markdown'],
    name: 'Markdown'
  },
  'text/plain': {
    extensions: ['.txt'],
    name: 'Text File'
  }
} as const

export const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB - reduced for cost savings
export const MIN_FILE_SIZE = 1 // 1 byte

export interface FileValidationResult {
  isValid: boolean
  error?: string
  fileType?: string
}

/**
 * Validate file type and size
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size < MIN_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File is empty'
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`
    }
  }

  // Check MIME type
  if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only PDF, DOC, DOCX, MD, and TXT files are allowed.'
    }
  }

  // Additional validation: check file extension matches MIME type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  const typeConfig = ACCEPTED_FILE_TYPES[file.type as keyof typeof ACCEPTED_FILE_TYPES]
  
  if (typeConfig && fileExtension && !(typeConfig.extensions as readonly string[]).includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension doesn't match file type. Expected ${typeConfig.extensions.join(' or ')} for ${typeConfig.name}`
    }
  }

  return {
    isValid: true,
    fileType: typeConfig?.name
  }
}

/**
 * Validate multiple files
 */
export function validateFiles(files: File[], maxFiles: number = 5): {
  validFiles: File[]
  invalidFiles: Array<{ file: File; error: string }>
  errors: string[]
} {
  const validFiles: File[] = []
  const invalidFiles: Array<{ file: File; error: string }> = []
  const errors: string[] = []

  // Check total file count
  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} files allowed.`)
    return { validFiles: [], invalidFiles: [], errors }
  }

  // Validate each file
  files.forEach(file => {
    const validation = validateFile(file)
    if (validation.isValid) {
      validFiles.push(file)
    } else {
      invalidFiles.push({ file, error: validation.error || 'Unknown error' })
    }
  })

  // Check for duplicate file names
  const fileNames = validFiles.map(f => f.name)
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index)
  if (duplicates.length > 0) {
    errors.push(`Duplicate file names found: ${duplicates.join(', ')}`)
  }

  return { validFiles, invalidFiles, errors }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file type display name from MIME type
 */
export function getFileTypeName(mimeType: string): string {
  const typeConfig = ACCEPTED_FILE_TYPES[mimeType as keyof typeof ACCEPTED_FILE_TYPES]
  return typeConfig?.name || 'Unknown'
}

/**
 * Get all accepted file extensions
 */
export function getAcceptedExtensions(): string[] {
  return Object.values(ACCEPTED_FILE_TYPES)
    .flatMap(config => config.extensions)
}

/**
 * Check if file extension is supported
 */
export function isExtensionSupported(fileName: string): boolean {
  const extension = '.' + fileName.split('.').pop()?.toLowerCase()
  return getAcceptedExtensions().includes(extension)
}