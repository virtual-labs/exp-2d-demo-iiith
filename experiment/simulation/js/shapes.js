"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { createMaterials } from "./materials.js";

// Create materials once at module level
const materials = createMaterials();

// function updateShapeList(shapeList) {
//   const shapeListDiv = document.getElementById("shape-list");
//   shapeListDiv.innerHTML = ""; // Clear previous list

//   const ul = document.createElement("ul");

//   shapeList.forEach((shape) => {
//     const li = document.createElement("li");

//     li.innerHTML = `
//       <div class="shape-info">
//         <span class="shape-id">${shape.id}</span>
//         <span class="coordinates">(${shape.x}, ${shape.y}, ${shape.z})</span>
//       </div>
//       <div class="button-group">
//         <button class="select-btn"
//                 data-name="${shape.id}"
//                 data-coordinates="${shape.x},${shape.y},${shape.z}">
//           Select
//         </button>
//         <button class="edit-btn"
//                 data-name="${shape.id}"
//                 data-coordinates="${shape.x},${shape.y},${shape.z}">
//           Edit
//         </button>
//         <button class="delete-btn"
//                 data-name="${shape.id}"
//                 data-coordinates="${shape.x},${shape.y},${shape.z}">
//           Delete
//         </button>
//       </div>
//     `;
//     ul.appendChild(li);
//   });

//   shapeListDiv.appendChild(ul);

//   // Attach event listeners for Select, Edit, and Delete buttons
//   document.querySelectorAll(".select-btn").forEach((button) => {
//     button.addEventListener("click", handleSelect, false);
//   });

//   document.querySelectorAll(".edit-btn").forEach((button) => {
//     button.addEventListener("click", handleEdit, false);
//   });

//   document.querySelectorAll(".delete-btn").forEach((button) => {
//     button.addEventListener("click", handleDelete, false);
//   });
// }

// function handleSelect(event) {
//   const shapeName = event.target.getAttribute("data-name");
//   const shapeCoordinates = event.target.getAttribute("data-coordinates");

//   console.log(`Shape Selected: ${shapeName}`);
//   console.log(`Coordinates: ${shapeCoordinates}`);
// }

// function handleEdit(event) {
//   const shapeName = event.target.getAttribute("data-name");
//   const shapeCoordinates = event.target.getAttribute("data-coordinates");

//   console.log(`Editing Shape: ${shapeName}`);
//   console.log(`Coordinates: ${shapeCoordinates}`);

//   // Implement editing logic here, e.g., open a modal for editing
// }

// function handleDelete(event) {
//   const shapeName = event.target.getAttribute("data-name");
//   const shapeCoordinates = event.target.getAttribute("data-coordinates");

//   console.log(`Deleting Shape: ${shapeName}`);
//   console.log(`Coordinates: ${shapeCoordinates}`);

//   // Implement deletion logic here, e.g., remove the shape from shapeList
// }

export const createCube = function (
  x,
  y,
  z,
  shapes,
  shapeList,
  shapeCount,
  scene,
  point,
  shapeVertex,
  dragX,
  dragY,
  dragZ
) {
  // Debug check for input parameters
  console.log('createCube called with coordinates:', { x, y, z });
  console.log('Coordinate types:', {
    x: typeof x,
    y: typeof y,
    z: typeof z
  });

  // Parse the string values to numbers
  const xcoord = parseFloat(x);
  const ycoord = parseFloat(y);
  const zcoord = parseFloat(z);

  console.log('Parsed coordinates:', { x: xcoord, y: ycoord, z: zcoord });

  if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
    console.error('Invalid position coordinates:', { x: xcoord, y: ycoord, z: zcoord });
    return null;
  }

  let geometry, material, cub;

  try {
    console.log('Creating cube geometry...');
    geometry = new THREE.BoxGeometry(1, 1, 1);
    if (!geometry) {
      throw new Error('Failed to create geometry');
    }

    console.log('Getting material...');
    material = materials.cubeShader;
    if (!material) {
      throw new Error('Failed to get material');
    }

    console.log('Creating mesh...');
    cub = new THREE.Mesh(geometry, material);
    if (!cub) {
      throw new Error('Failed to create mesh');
    }

    console.log('Setting cube position...');
    // Set position with parsed values
    cub.position.set(xcoord, ycoord, zcoord);
    cub.updateMatrix();
    
    cub.name = "Cube";
    cub.userData.id = `Cube-${shapeCount[0]}`;
    cub.userData.selected = false;
    
    console.log('Adding cube to scene...');
    scene.add(cub);
    shapes.push(cub);
    
    // Add to shapeList with parsed values
    const newEntry = {
      id: cub.userData.id,
      x: xcoord,
      y: ycoord,
      z: zcoord,
      type: "Cube"
    };
    shapeList.push(newEntry);
    console.log('Added to shapeList:', newEntry);
    
    shapeCount[0]++;
    console.log('Cube created with ID:', cub.userData.id);
    
    return cub;
  } catch (error) {
    console.error('Error creating cube:', error);
    return null;
  }
};

export const createTetrahedron = function (
  x,
  y,
  z,
  shapes,
  shapeList,
  shapeCount,
  scene,
  point,
  shapeVertex,
  dragX,
  dragY,
  dragZ
) {
  // Debug check for input parameters
  console.log('createTetrahedron called with coordinates:', { x, y, z });
  console.log('Coordinate types:', {
    x: typeof x,
    y: typeof y,
    z: typeof z
  });

  // Parse the string values to numbers
  const xcoord = parseFloat(x);
  const ycoord = parseFloat(y);
  const zcoord = parseFloat(z);

  console.log('Parsed coordinates:', { x: xcoord, y: ycoord, z: zcoord });

  if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
    console.error('Invalid position coordinates:', { x: xcoord, y: ycoord, z: zcoord });
    return null;
  }

  let geometry, material, tetra;

  try {
    console.log('Creating tetrahedron geometry...');
    geometry = new THREE.TetrahedronGeometry(1);
    if (!geometry) {
      throw new Error('Failed to create geometry');
    }

    console.log('Getting material...');
    material = materials.tetrahedronShader;
    if (!material) {
      throw new Error('Failed to get material');
    }

    console.log('Creating mesh...');
    tetra = new THREE.Mesh(geometry, material);
    if (!tetra) {
      throw new Error('Failed to create mesh');
    }

    console.log('Setting tetrahedron position...');
    // Set position with parsed values
    tetra.position.set(xcoord, ycoord, zcoord);
    tetra.updateMatrix();
    
    tetra.name = "Tetrahedron";
    tetra.userData.id = `Tetrahedron-${shapeCount[1]}`;
    tetra.userData.selected = false;
    
    console.log('Adding tetrahedron to scene...');
    scene.add(tetra);
    shapes.push(tetra);
    
    // Add to shapeList with parsed values
    const newEntry = {
      id: tetra.userData.id,
      x: xcoord,
      y: ycoord,
      z: zcoord,
      type: "Tetrahedron"
    };
    shapeList.push(newEntry);
    console.log('Added to shapeList:', newEntry);
    
    shapeCount[1]++;
    console.log('Tetrahedron created with ID:', tetra.userData.id);
    
    return tetra;
  } catch (error) {
    console.error('Error creating tetrahedron:', error);
    return null;
  }
};

export const createOctahedron = function (
  x,
  y,
  z,
  shapes,
  shapeList,
  shapeCount,
  scene,
  point,
  shapeVertex,
  dragX,
  dragY,
  dragZ
) {
  // Debug check for input parameters
  console.log('createOctahedron called with coordinates:', { x, y, z });
  console.log('Coordinate types:', {
    x: typeof x,
    y: typeof y,
    z: typeof z
  });

  // Parse the string values to numbers
  const xcoord = parseFloat(x);
  const ycoord = parseFloat(y);
  const zcoord = parseFloat(z);

  console.log('Parsed coordinates:', { x: xcoord, y: ycoord, z: zcoord });

  if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
    console.error('Invalid position coordinates:', { x: xcoord, y: ycoord, z: zcoord });
    return null;
  }

  let geometry, material, octa;

  try {
    console.log('Creating octahedron geometry...');
    geometry = new THREE.OctahedronGeometry(1);
    if (!geometry) {
      throw new Error('Failed to create geometry');
    }

    console.log('Getting material...');
    material = materials.octahedronShader;
    if (!material) {
      throw new Error('Failed to get material');
    }

    console.log('Creating mesh...');
    octa = new THREE.Mesh(geometry, material);
    if (!octa) {
      throw new Error('Failed to create mesh');
    }

    console.log('Setting octahedron position...');
    // Set position with parsed values
    octa.position.set(xcoord, ycoord, zcoord);
    octa.updateMatrix();
    
    console.log('Octahedron position set to:', octa.position);
    console.log('Position components:', {
      x: octa.position.x,
      y: octa.position.y,
      z: octa.position.z
    });
    
    octa.name = "Octahedron";
    octa.userData.id = `Octahedron-${shapeCount[2]}`;
    octa.userData.selected = false;
    
    console.log('Adding octahedron to scene...');
    scene.add(octa);
    shapes.push(octa);
    
    // Add to shapeList with parsed values
    const newEntry = {
      id: octa.userData.id,
      x: xcoord,
      y: ycoord,
      z: zcoord,
      type: "Octahedron"
    };
    shapeList.push(newEntry);
    console.log('Added to shapeList:', newEntry);
    
    shapeCount[2]++;
    console.log('Octahedron created with ID:', octa.userData.id);
    
    return octa;
  } catch (error) {
    console.error('Error creating octahedron:', error);
    return null;
  }
};
