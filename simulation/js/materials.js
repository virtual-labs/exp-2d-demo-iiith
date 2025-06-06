"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

function vertexShader() {
    return `varying vec3 vUv; 
      
                  void main() {
                    vUv = position; 
      
                    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewPosition; 
                  }`;
}

function fragmentShader() {
    return `uniform vec3 colorA; 
                    uniform vec3 colorB; 
                    varying vec3 vUv;
      
                    void main() {
                  gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
                    }`;
}

export function createMaterials() {
    try {
        // Create materials with proper colors and transparency
        const cubeShader = new THREE.MeshBasicMaterial({ 
            color: 0xff0000, // Red
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        const tetrahedronShader = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, // Green
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        const octahedronShader = new THREE.MeshBasicMaterial({ 
            color: 0x0000ff, // Blue
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });

        // Ensure materials are properly initialized
        cubeShader.needsUpdate = true;
        tetrahedronShader.needsUpdate = true;
        octahedronShader.needsUpdate = true;

        // Validate materials
        if (!cubeShader || !tetrahedronShader || !octahedronShader) {
            throw new Error('Failed to create materials');
        }

        return {
            cubeShader,
            tetrahedronShader,
            octahedronShader
        };
    } catch (error) {
        console.error('Error creating materials:', error);
        // Return basic materials as fallback
        const fallbackMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            side: THREE.DoubleSide
        });
        fallbackMaterial.needsUpdate = true;
        return {
            cubeShader: fallbackMaterial,
            tetrahedronShader: fallbackMaterial,
            octahedronShader: fallbackMaterial
        };
    }
}
