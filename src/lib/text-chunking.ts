export interface TextChunk {
  content: string
  chunkIndex: number
  tokenCount: number
  characterCount: number
}

export interface ChunkingOptions {
  maxChunkSize: number // Maximum characters per chunk
  overlap: number // Character overlap between chunks
  preserveSentences: boolean // Try to keep sentences intact
}

const DEFAULT_CHUNKING_OPTIONS: ChunkingOptions = {
  maxChunkSize: 1500, // Good size for embeddings
  overlap: 200, // 15% overlap
  preserveSentences: true
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters for English)
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4)
}

/**
 * Split text into sentences using multiple delimiters
 */
function splitIntoSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by whitespace or end of string
  const sentences = text.split(/(?<=[.!?])\s+/)
  return sentences.filter(sentence => sentence.trim().length > 0)
}

/**
 * Split text into paragraphs
 */
function splitIntoParagraphs(text: string): string[] {
  return text.split(/\n\s*\n/)
    .map(para => para.trim())
    .filter(para => para.length > 0)
}

/**
 * Create chunks from text with sentence preservation
 */
function createSentenceAwareChunks(
  text: string, 
  maxChunkSize: number, 
  overlap: number
): TextChunk[] {
  const sentences = splitIntoSentences(text)
  const chunks: TextChunk[] = []
  let currentChunk = ''
  let chunkIndex = 0

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence

    // If adding this sentence would exceed the limit, save current chunk
    if (potentialChunk.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        content: currentChunk.trim(),
        chunkIndex,
        tokenCount: estimateTokenCount(currentChunk),
        characterCount: currentChunk.length
      })

      // Start new chunk with overlap
      if (overlap > 0) {
        // Find sentences to include in overlap
        const overlapText = currentChunk.slice(-overlap)
        currentChunk = overlapText + ' ' + sentence
      } else {
        currentChunk = sentence
      }
      
      chunkIndex++
    } else {
      currentChunk = potentialChunk
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      chunkIndex,
      tokenCount: estimateTokenCount(currentChunk),
      characterCount: currentChunk.length
    })
  }

  return chunks
}

/**
 * Create chunks with simple character splitting (fallback)
 */
function createSimpleChunks(
  text: string, 
  maxChunkSize: number, 
  overlap: number
): TextChunk[] {
  const chunks: TextChunk[] = []
  let start = 0
  let chunkIndex = 0

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length)
    const chunkText = text.slice(start, end)

    chunks.push({
      content: chunkText,
      chunkIndex,
      tokenCount: estimateTokenCount(chunkText),
      characterCount: chunkText.length
    })

    // Move start position considering overlap
    start = end - overlap
    if (start <= 0) start = end
    chunkIndex++
  }

  return chunks
}

/**
 * Main chunking function
 */
export function chunkText(
  text: string, 
  options: Partial<ChunkingOptions> = {}
): TextChunk[] {
  const opts = { ...DEFAULT_CHUNKING_OPTIONS, ...options }
  
  // Clean up the text
  const cleanText = text.trim().replace(/\s+/g, ' ')
  
  // If text is smaller than max chunk size, return as single chunk
  if (cleanText.length <= opts.maxChunkSize) {
    return [{
      content: cleanText,
      chunkIndex: 0,
      tokenCount: estimateTokenCount(cleanText),
      characterCount: cleanText.length
    }]
  }

  // Use sentence-aware chunking if requested
  if (opts.preserveSentences) {
    try {
      return createSentenceAwareChunks(cleanText, opts.maxChunkSize, opts.overlap)
    } catch (error) {
      console.warn('Sentence-aware chunking failed, falling back to simple chunking:', error)
    }
  }

  // Fallback to simple character-based chunking
  return createSimpleChunks(cleanText, opts.maxChunkSize, opts.overlap)
}

/**
 * Get chunking statistics
 */
export function getChunkingStats(chunks: TextChunk[]) {
  const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0)
  const totalCharacters = chunks.reduce((sum, chunk) => sum + chunk.characterCount, 0)
  const avgTokensPerChunk = totalTokens / chunks.length
  const avgCharsPerChunk = totalCharacters / chunks.length

  return {
    totalChunks: chunks.length,
    totalTokens,
    totalCharacters,
    avgTokensPerChunk: Math.round(avgTokensPerChunk),
    avgCharsPerChunk: Math.round(avgCharsPerChunk),
    minChunkSize: Math.min(...chunks.map(c => c.characterCount)),
    maxChunkSize: Math.max(...chunks.map(c => c.characterCount))
  }
}