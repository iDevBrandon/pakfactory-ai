// 3D Shape Generation Utilities
// This creates basic shapes based on text input without external dependencies

export interface Shape3D {
  vertices: Float32Array
  indices: Uint16Array
  colors: Float32Array
  normals: Float32Array
  name: string
}

export function analyzePrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase()
  
  // Packaging-specific shapes (check first for priority)
  if (lowerPrompt.includes('tulip') || lowerPrompt.includes('f103')) {
    return 'tulip'
  }
  if (lowerPrompt.includes('burger') || lowerPrompt.includes('f102') || 
      lowerPrompt.includes('food box') || lowerPrompt.includes('takeout')) {
    return 'burger'
  }
  if (lowerPrompt.includes('sandwich') || lowerPrompt.includes('wedge') || 
      lowerPrompt.includes('f101') || lowerPrompt.includes('triangle')) {
    return 'sandwich'
  }
  if (lowerPrompt.includes('cake') || lowerPrompt.includes('f099') || 
      lowerPrompt.includes('tall box') || lowerPrompt.includes('handle')) {
    return 'cake'
  }
  if (lowerPrompt.includes('tray') || lowerPrompt.includes('f098') || 
      lowerPrompt.includes('stripper') || lowerPrompt.includes('lock') ||
      lowerPrompt.includes('flat')) {
    return 'tray'
  }
  if (lowerPrompt.includes('t box') || lowerPrompt.includes('f097') ||
      lowerPrompt.includes('t-box')) {
    return 'tray' // Similar to tray for now
  }
  if (lowerPrompt.includes('hanger') || lowerPrompt.includes('f046') ||
      lowerPrompt.includes('tuck') || lowerPrompt.includes('panel')) {
    return 'cake' // Tall box style
  }
  
  // Basic geometric shapes
  if (lowerPrompt.includes('crown') || lowerPrompt.includes('golden crown')) {
    return 'crown'
  }
  if (lowerPrompt.includes('sphere') || lowerPrompt.includes('ball')) {
    return 'sphere'
  }
  if (lowerPrompt.includes('pyramid')) {
    return 'pyramid'
  }
  if (lowerPrompt.includes('cylinder') || lowerPrompt.includes('tube') || lowerPrompt.includes('can')) {
    return 'cylinder'
  }
  if (lowerPrompt.includes('cube') || lowerPrompt.includes('box')) {
    return 'cube'
  }
  
  // Default fallback
  return 'cube'
}

export function getShapeColor(prompt: string): [number, number, number] {
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('red')) return [1.0, 0.2, 0.2]
  if (lowerPrompt.includes('blue')) return [0.2, 0.4, 1.0]
  if (lowerPrompt.includes('green')) return [0.2, 0.8, 0.2]
  if (lowerPrompt.includes('yellow')) return [1.0, 1.0, 0.2]
  if (lowerPrompt.includes('golden') || lowerPrompt.includes('gold')) return [1.0, 0.8, 0.2]
  if (lowerPrompt.includes('silver')) return [0.8, 0.8, 0.9]
  if (lowerPrompt.includes('purple') || lowerPrompt.includes('violet')) return [0.8, 0.2, 0.8]
  if (lowerPrompt.includes('orange')) return [1.0, 0.6, 0.2]
  if (lowerPrompt.includes('pink')) return [1.0, 0.4, 0.7]
  if (lowerPrompt.includes('white')) return [0.95, 0.95, 0.95]
  if (lowerPrompt.includes('black')) return [0.2, 0.2, 0.2]
  if (lowerPrompt.includes('beige') || lowerPrompt.includes('tan')) return [0.96, 0.87, 0.70]
  if (lowerPrompt.includes('brown')) return [0.6, 0.4, 0.2]
  
  // Default color
  return [0.5, 0.7, 1.0]
}

export function createCube(color: [number, number, number] = [0.5, 0.7, 1.0]): Shape3D {
  const vertices = new Float32Array([
    // Front face
    -1, -1,  1,
     1, -1,  1,
     1,  1,  1,
    -1,  1,  1,
    // Back face
    -1, -1, -1,
    -1,  1, -1,
     1,  1, -1,
     1, -1, -1,
    // Top face
    -1,  1, -1,
    -1,  1,  1,
     1,  1,  1,
     1,  1, -1,
    // Bottom face
    -1, -1, -1,
     1, -1, -1,
     1, -1,  1,
    -1, -1,  1,
    // Right face
     1, -1, -1,
     1,  1, -1,
     1,  1,  1,
     1, -1,  1,
    // Left face
    -1, -1, -1,
    -1, -1,  1,
    -1,  1,  1,
    -1,  1, -1,
  ])

  const indices = new Uint16Array([
    0,  1,  2,    0,  2,  3,    // front
    4,  5,  6,    4,  6,  7,    // back
    8,  9, 10,    8, 10, 11,    // top
   12, 13, 14,   12, 14, 15,    // bottom
   16, 17, 18,   16, 18, 19,    // right
   20, 21, 22,   20, 22, 23,    // left
  ])

  // Create colors for each vertex
  const colors = new Float32Array(vertices.length)
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = color[0]
    colors[i + 1] = color[1]
    colors[i + 2] = color[2]
  }

  // Create normals
  const normals = new Float32Array([
    // Front face
    0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
    // Back face
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top face
    0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
    // Bottom face
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right face
    1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
    // Left face
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
  ])

  return {
    vertices,
    indices,
    colors,
    normals,
    name: 'Cube'
  }
}

export function createSphere(segments: number = 16, color: [number, number, number] = [0.5, 0.7, 1.0]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Generate vertices
  for (let lat = 0; lat <= segments; lat++) {
    const theta = (lat * Math.PI) / segments
    const sinTheta = Math.sin(theta)
    const cosTheta = Math.cos(theta)

    for (let lon = 0; lon <= segments; lon++) {
      const phi = (lon * 2 * Math.PI) / segments
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)

      const x = cosPhi * sinTheta
      const y = cosTheta
      const z = sinPhi * sinTheta

      vertices.push(x, y, z)
      normals.push(x, y, z)
      colors.push(color[0], color[1], color[2])
    }
  }

  // Generate indices
  for (let lat = 0; lat < segments; lat++) {
    for (let lon = 0; lon < segments; lon++) {
      const first = lat * (segments + 1) + lon
      const second = first + segments + 1

      indices.push(first, second, first + 1)
      indices.push(second, second + 1, first + 1)
    }
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Sphere'
  }
}

export function createPyramid(color: [number, number, number] = [0.5, 0.7, 1.0]): Shape3D {
  const vertices = new Float32Array([
    // Base
    -1, -1, -1,
     1, -1, -1,
     1, -1,  1,
    -1, -1,  1,
    // Top point
     0,  1,  0
  ])

  const indices = new Uint16Array([
    // Base
    0, 1, 2,  0, 2, 3,
    // Sides
    0, 4, 1,
    1, 4, 2,
    2, 4, 3,
    3, 4, 0
  ])

  const colors = new Float32Array(vertices.length)
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = color[0]
    colors[i + 1] = color[1]
    colors[i + 2] = color[2]
  }

  // Calculate normals
  const normals = new Float32Array([
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0, // Base
    0, 1, 0 // Top
  ])

  return {
    vertices,
    indices,
    colors,
    normals,
    name: 'Pyramid'
  }
}

export function createCrown(color: [number, number, number] = [1.0, 0.8, 0.2]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Base ring
  const baseRadius = 1.2
  const baseHeight = 0.2
  const segments = 16
  
  // Bottom ring
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * baseRadius
    const z = Math.sin(angle) * baseRadius
    
    vertices.push(x, -baseHeight, z)
    normals.push(0, -1, 0)
    colors.push(color[0], color[1], color[2])
  }

  // Top ring
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * baseRadius
    const z = Math.sin(angle) * baseRadius
    
    vertices.push(x, baseHeight, z)
    normals.push(0, 1, 0)
    colors.push(color[0], color[1], color[2])
  }

  // Crown spikes (every 4th segment gets a spike)
  for (let i = 0; i < segments; i += 4) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * baseRadius * 0.8
    const z = Math.sin(angle) * baseRadius * 0.8
    const height = 0.8
    
    vertices.push(x, height, z)
    normals.push(0, 1, 0)
    colors.push(color[0] * 1.1, color[1] * 1.1, color[2] * 1.1) // Slightly brighter
  }

  // Generate indices for base
  for (let i = 0; i < segments; i++) {
    const bottom1 = i
    const bottom2 = i + 1
    const top1 = i + segments + 1
    const top2 = i + segments + 2

    // Side faces
    indices.push(bottom1, bottom2, top1)
    indices.push(bottom2, top2, top1)
  }

  // Generate indices for spikes
  const spikeStart = (segments + 1) * 2
  let spikeIndex = 0
  for (let i = 0; i < segments; i += 4) {
    const top1 = i + segments + 1
    const top2 = ((i + 1) % segments) + segments + 1
    const top3 = ((i + 2) % segments) + segments + 1
    const top4 = ((i + 3) % segments) + segments + 1
    const spike = spikeStart + spikeIndex

    // Connect spike to surrounding top vertices
    indices.push(top1, spike, top2)
    indices.push(top2, spike, top3)
    indices.push(top3, spike, top4)
    indices.push(top4, spike, top1)

    spikeIndex++
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Crown'
  }
}

export function createCylinder(segments: number = 16, color: [number, number, number] = [0.5, 0.7, 1.0]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  const height = 2
  const radius = 1

  // Top center
  vertices.push(0, height/2, 0)
  normals.push(0, 1, 0)
  colors.push(color[0], color[1], color[2])

  // Bottom center
  vertices.push(0, -height/2, 0)
  normals.push(0, -1, 0)
  colors.push(color[0], color[1], color[2])

  // Top and bottom rings
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    // Top ring
    vertices.push(x, height/2, z)
    normals.push(0, 1, 0)
    colors.push(color[0], color[1], color[2])

    // Bottom ring
    vertices.push(x, -height/2, z)
    normals.push(0, -1, 0)
    colors.push(color[0], color[1], color[2])
  }

  // Side vertices
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const nx = Math.cos(angle)
    const nz = Math.sin(angle)

    // Top side
    vertices.push(x, height/2, z)
    normals.push(nx, 0, nz)
    colors.push(color[0], color[1], color[2])

    // Bottom side
    vertices.push(x, -height/2, z)
    normals.push(nx, 0, nz)
    colors.push(color[0], color[1], color[2])
  }

  // Generate indices
  const topCenter = 0
  const bottomCenter = 1
  const topRingStart = 2
  const sideStart = 2 + (segments + 1) * 2

  // Top face
  for (let i = 0; i < segments; i++) {
    const current = topRingStart + i * 2
    const next = topRingStart + ((i + 1) % segments) * 2
    indices.push(topCenter, next, current)
  }

  // Bottom face
  for (let i = 0; i < segments; i++) {
    const current = topRingStart + i * 2 + 1
    const next = topRingStart + ((i + 1) % segments) * 2 + 1
    indices.push(bottomCenter, current, next)
  }

  // Side faces
  for (let i = 0; i < segments; i++) {
    const topCurrent = sideStart + i * 2
    const topNext = sideStart + ((i + 1) % segments) * 2
    const bottomCurrent = sideStart + i * 2 + 1
    const bottomNext = sideStart + ((i + 1) % segments) * 2 + 1

    indices.push(topCurrent, bottomCurrent, topNext)
    indices.push(topNext, bottomCurrent, bottomNext)
  }

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Cylinder'
  }
}

// Packaging-specific shapes
export function createTulipBox(color: [number, number, number] = [0.9, 0.7, 0.5]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Base box dimensions
  const width = 1.2
  const depth = 1.2
  const height = 1.0
  const curveHeight = 0.4

  // Base vertices (rectangular base)
  const baseVertices = [
    [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2],
    [width/2, -height/2, depth/2], [-width/2, -height/2, depth/2],
    [-width/2, height/2 - curveHeight, -depth/2], [width/2, height/2 - curveHeight, -depth/2],
    [width/2, height/2 - curveHeight, depth/2], [-width/2, height/2 - curveHeight, depth/2]
  ]

  // Add base vertices
  baseVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0], color[1], color[2])
  })

  // Create curved top (tulip opening)
  const segments = 12
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    const radius = width * 0.4
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = height/2 + Math.sin(i * 0.5) * 0.2 // Slight wave for tulip effect
    
    vertices.push(x, y, z)
    normals.push(x/radius, 1, z/radius)
    colors.push(color[0] * 1.1, color[1] * 1.1, color[2] * 1.1) // Slightly brighter top
  }

  // Base indices (box faces)
  const baseIndices = [
    0, 1, 5, 0, 5, 4, // Front
    1, 2, 6, 1, 6, 5, // Right  
    2, 3, 7, 2, 7, 6, // Back
    3, 0, 4, 3, 4, 7, // Left
    0, 3, 2, 0, 2, 1  // Bottom
  ]

  indices.push(...baseIndices)

  // Connect curved top
  const topStart = 8
  for (let i = 0; i < segments; i++) {
    const current = topStart + i
    const next = topStart + (i + 1) % segments
    
    // Connect to base top vertices
    indices.push(4, current, next) // Front edge
    indices.push(5, next, current) // etc.
  }

  // Fill remaining normals for base
  const baseNormals = [
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom face normals
    0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1   // Side face normals
  ]
  normals.unshift(...baseNormals)

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Tulip Box'
  }
}

export function createBurgerBox(color: [number, number, number] = [0.8, 0.6, 0.4]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Flat burger box dimensions
  const width = 1.5
  const depth = 1.5
  const height = 0.4 // Much flatter than regular box

  // Create flat box vertices
  const boxVertices = [
    // Bottom face
    [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2],
    [width/2, -height/2, depth/2], [-width/2, -height/2, depth/2],
    // Top face
    [-width/2, height/2, -depth/2], [width/2, height/2, -depth/2],
    [width/2, height/2, depth/2], [-width/2, height/2, depth/2]
  ]

  boxVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0], color[1], color[2])
  })

  // Box normals
  const boxNormals = [
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0       // Top
  ]
  normals.push(...boxNormals)

  // Box indices
  const boxIndices = [
    0, 1, 5, 0, 5, 4, // Front
    1, 2, 6, 1, 6, 5, // Right
    2, 3, 7, 2, 7, 6, // Back
    3, 0, 4, 3, 4, 7, // Left
    4, 5, 6, 4, 6, 7, // Top
    3, 2, 1, 3, 1, 0  // Bottom
  ]

  indices.push(...boxIndices)

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Burger Box'
  }
}

export function createSandwichWedge(color: [number, number, number] = [0.9, 0.8, 0.6]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Triangular wedge for sandwich
  const width = 1.5
  const depth = 1.0
  const height = 0.8

  // Wedge vertices (triangular prism)
  const wedgeVertices = [
    // Bottom face (triangle)
    [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2], [0, height/2, -depth/2],
    // Top face (triangle)  
    [-width/2, -height/2, depth/2], [width/2, -height/2, depth/2], [0, height/2, depth/2]
  ]

  wedgeVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0], color[1], color[2])
  })

  // Wedge normals (simplified)
  const wedgeNormals = [
    0, 0, -1, 0, 0, -1, 0, 0, -1, // Back triangle
    0, 0, 1, 0, 0, 1, 0, 0, 1     // Front triangle
  ]
  normals.push(...wedgeNormals)

  // Wedge indices
  const wedgeIndices = [
    0, 1, 2,       // Back triangle
    3, 5, 4,       // Front triangle
    0, 3, 4, 0, 4, 1, // Bottom face
    1, 4, 5, 1, 5, 2, // Right face
    2, 5, 3, 2, 3, 0  // Left face
  ]

  indices.push(...wedgeIndices)

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Sandwich Wedge'
  }
}

export function createCakeBox(color: [number, number, number] = [0.9, 0.9, 0.9]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Tall cake box with handle
  const width = 1.4
  const depth = 1.4  
  const height = 1.8 // Much taller

  // Main box vertices
  const boxVertices = [
    // Bottom face
    [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2],
    [width/2, -height/2, depth/2], [-width/2, -height/2, depth/2],
    // Top face
    [-width/2, height/2, -depth/2], [width/2, height/2, -depth/2],
    [width/2, height/2, depth/2], [-width/2, height/2, depth/2]
  ]

  boxVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0], color[1], color[2])
  })

  // Add handle on top
  const handleVertices = [
    [-0.2, height/2 + 0.1, -0.1], [0.2, height/2 + 0.1, -0.1],
    [0.2, height/2 + 0.3, -0.1], [-0.2, height/2 + 0.3, -0.1],
    [-0.2, height/2 + 0.1, 0.1], [0.2, height/2 + 0.1, 0.1],
    [0.2, height/2 + 0.3, 0.1], [-0.2, height/2 + 0.3, 0.1]
  ]

  handleVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8) // Darker handle
  })

  // Box normals
  const allNormals = [
    // Box normals
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,      // Top
    // Handle normals (simplified)
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
  ]
  normals.push(...allNormals)

  // Box indices
  const boxIndices = [
    0, 1, 5, 0, 5, 4, // Front
    1, 2, 6, 1, 6, 5, // Right
    2, 3, 7, 2, 7, 6, // Back
    3, 0, 4, 3, 4, 7, // Left
    4, 5, 6, 4, 6, 7, // Top
    3, 2, 1, 3, 1, 0  // Bottom
  ]

  // Handle indices (offset by 8 for box vertices)
  const handleIndices = [
    8, 9, 13, 8, 13, 12,   // Front
    9, 10, 14, 9, 14, 13,  // Right
    10, 11, 15, 10, 15, 14, // Back
    11, 8, 12, 11, 12, 15,  // Left
    12, 13, 14, 12, 14, 15  // Top
  ]

  indices.push(...boxIndices, ...handleIndices)

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Cake Box'
  }
}

export function createTrayBox(color: [number, number, number] = [0.8, 0.7, 0.6]): Shape3D {
  const vertices: number[] = []
  const indices: number[] = []
  const colors: number[] = []
  const normals: number[] = []

  // Flat tray box
  const width = 2.0  // Wider
  const depth = 1.5  // Deeper
  const height = 0.3 // Very shallow

  // Tray vertices
  const trayVertices = [
    // Bottom face
    [-width/2, -height/2, -depth/2], [width/2, -height/2, -depth/2],
    [width/2, -height/2, depth/2], [-width/2, -height/2, depth/2],
    // Top face (slightly inset to show tray walls)
    [-width/2 + 0.1, height/2, -depth/2 + 0.1], [width/2 - 0.1, height/2, -depth/2 + 0.1],
    [width/2 - 0.1, height/2, depth/2 - 0.1], [-width/2 + 0.1, height/2, depth/2 - 0.1]
  ]

  trayVertices.forEach(([x, y, z]) => {
    vertices.push(x, y, z)
    colors.push(color[0], color[1], color[2])
  })

  // Tray normals
  const trayNormals = [
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0       // Top
  ]
  normals.push(...trayNormals)

  // Tray indices
  const trayIndices = [
    0, 1, 5, 0, 5, 4, // Front
    1, 2, 6, 1, 6, 5, // Right
    2, 3, 7, 2, 7, 6, // Back
    3, 0, 4, 3, 4, 7, // Left
    4, 5, 6, 4, 6, 7, // Top
    3, 2, 1, 3, 1, 0  // Bottom
  ]

  indices.push(...trayIndices)

  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    name: 'Tray Box'
  }
}

export function generateShape(prompt: string): Shape3D {
  const shapeType = analyzePrompt(prompt)
  const color = getShapeColor(prompt)

  switch (shapeType) {
    case 'tulip':
    case 'tulip_box':
      return createTulipBox(color)
    case 'burger':
    case 'burger_box':
    case 'food_box':
      return createBurgerBox(color)
    case 'sandwich':
    case 'wedge':
    case 'sandwich_wedge':
      return createSandwichWedge(color)
    case 'cake':
    case 'cake_box':
      return createCakeBox(color)
    case 'tray':
    case 'tray_box':
      return createTrayBox(color)
    case 'crown':
      return createCrown(color)
    case 'sphere':
      return createSphere(16, color)
    case 'pyramid':
      return createPyramid(color)
    case 'cylinder':
      return createCylinder(16, color)
    case 'cube':
    default:
      return createCube(color)
  }
}