"use client"

import { useEffect, useRef } from "react"

export interface ThreeRendererProps {
  vertices: Float32Array
  indices: Uint16Array
  colors: Float32Array
  normals: Float32Array
  className?: string
}

export function ThreeRenderer({
  vertices,
  indices,
  colors,
  normals,
  className = ""
}: ThreeRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    rotationX: 0.2,
    rotationY: 0
  })
  const autoRotationRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) {
      console.error("WebGL not supported")
      return
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_color;
      attribute vec3 a_normal;
      
      uniform mat4 u_modelViewMatrix;
      uniform mat4 u_projectionMatrix;
      uniform vec3 u_lightDirection;
      
      varying vec3 v_color;
      varying float v_lighting;
      
      void main() {
        gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
        
        // Simple lighting calculation
        vec3 normal = normalize(a_normal);
        float lightIntensity = max(dot(normal, normalize(u_lightDirection)), 0.3);
        v_lighting = lightIntensity;
        v_color = a_color;
      }
    `

    // Fragment shader source
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec3 v_color;
      varying float v_lighting;
      
      void main() {
        gl_FragColor = vec4(v_color * v_lighting, 1.0);
      }
    `

    // Create and compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) throw new Error("Failed to create shader")
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw new Error(`Shader compilation error: ${error}`)
      }
      
      return shader
    }

    // Create program
    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()
      if (!program) throw new Error("Failed to create program")
      
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getProgramInfoLog(program)
        gl.deleteProgram(program)
        throw new Error(`Program linking error: ${error}`)
      }
      
      return program
    }

    // Initialize WebGL
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = createProgram(gl, vertexShader, fragmentShader)

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "a_position")
    const colorLocation = gl.getAttribLocation(program, "a_color")
    const normalLocation = gl.getAttribLocation(program, "a_normal")
    const modelViewMatrixLocation = gl.getUniformLocation(program, "u_modelViewMatrix")
    const projectionMatrixLocation = gl.getUniformLocation(program, "u_projectionMatrix")
    const lightDirectionLocation = gl.getUniformLocation(program, "u_lightDirection")

    // Create buffers
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)

    const normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    // Matrix utilities
    function createProjectionMatrix(fov: number, aspect: number, near: number, far: number) {
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
      const rangeInv = 1.0 / (near - far)

      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
      ]
    }

    function createModelViewMatrix(rotationX: number, rotationY: number) {
      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)

      return [
        cosY, 0, sinY, 0,
        sinX * sinY, cosX, -sinX * cosY, 0,
        -cosX * sinY, sinX, cosX * cosY, 0,
        0, 0, -5, 1
      ]
    }

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true
      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
      canvas.style.cursor = 'grabbing'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseRef.current.isDown) return

      const deltaX = e.clientX - mouseRef.current.lastX
      const deltaY = e.clientY - mouseRef.current.lastY

      mouseRef.current.rotationY += deltaX * 0.01
      mouseRef.current.rotationX += deltaY * 0.01

      // Clamp vertical rotation
      mouseRef.current.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, mouseRef.current.rotationX))

      mouseRef.current.lastX = e.clientX
      mouseRef.current.lastY = e.clientY
    }

    const handleMouseUp = () => {
      mouseRef.current.isDown = false
      canvas.style.cursor = 'grab'
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Zoom could be added here in the future
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel)
    canvas.style.cursor = 'grab'

    // Render loop
    function render() {
      if (!canvas || !gl) return

      // Update auto-rotation (only when not being manually controlled)
      if (!mouseRef.current.isDown) {
        autoRotationRef.current += 0.01
      }

      // Combine auto-rotation with mouse control
      const finalRotationY = mouseRef.current.rotationY + autoRotationRef.current
      const finalRotationX = mouseRef.current.rotationX

      // Set viewport
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)

      // Clear canvas
      gl.clearColor(0.95, 0.95, 0.98, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      gl.enable(gl.DEPTH_TEST)
      gl.enable(gl.CULL_FACE)

      // Use program
      gl.useProgram(program)

      // Set up matrices
      const projectionMatrix = createProjectionMatrix(
        Math.PI / 4,
        canvas.width / canvas.height,
        1,
        100
      )
      const modelViewMatrix = createModelViewMatrix(
        finalRotationX, 
        finalRotationY
      )

      gl.uniformMatrix4fv(projectionMatrixLocation, false, new Float32Array(projectionMatrix))
      gl.uniformMatrix4fv(modelViewMatrixLocation, false, new Float32Array(modelViewMatrix))
      gl.uniform3fv(lightDirectionLocation, [0.5, 1.0, 0.5])

      // Bind position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)

      // Bind color buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
      gl.enableVertexAttribArray(colorLocation)
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0)

      // Bind normal buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
      gl.enableVertexAttribArray(normalLocation)
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)

      // Bind index buffer and draw
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      // Clean up event listeners
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
    }
  }, [vertices, indices, colors, normals])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  )
}