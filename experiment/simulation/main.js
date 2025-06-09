"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
import {
  createCube,
  createOctahedron,
  createTetrahedron,
} from "./js/shapes.js";
import { Triangle } from "./js/Triangle.js";

const moveButton = document.getElementById("move-button");
const modalbutton1 = document.querySelector(".edit-button");
const modalbutton2 = document.querySelector(".add-button");
let lockVertices = document.getElementById("lock-vertices-cb");
let lockZoom = document.getElementById("lock-zoom-cb");
let lockRotate = document.getElementById("lock-rotate-cb");
let xyGrid = document.getElementById("xy-grid-cb");
let yzGrid = document.getElementById("yz-grid-cb");
let xzGrid = document.getElementById("xz-grid-cb");
let container = document.getElementById("canvas-main");

let modalAdd = document.getElementById("add-modal");
const editModal = document.getElementById("edit-modal");
const spanEditModal = document.getElementsByClassName("close")[0];
const modalEditButton = document.querySelector(".edit-button");
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max = 1000;
document.getElementById("slider").min = 0;
slider.step = 1;

let trans_matrix = new THREE.Matrix4();
trans_matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

let shapeCount = [0, 0, 0, 0];

var max_x_scale = document.getElementById("scale-x").value;
var max_y_scale = document.getElementById("scale-y").value;
var max_z_scale = document.getElementById("scale-z").value;
var transX = parseFloat(document.getElementById("trans-x").value);
var transY = parseFloat(document.getElementById("trans-y").value);
var transZ = parseFloat(document.getElementById("trans-z").value);

let old_scale = [1, 1, 1];
let old_position = [0, 0, 0];

let frames = 1000;
let scene,
  PI = 3.141592653589793,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  vargrid1 = 0,
  vargrid2 = 0,
  vargrid3 = 0,
  xygrid = [],
  yzgrid = [],
  xzgrid = [],
  dragX = [],
  dragY = [],
  dragz = [],
  shapeList = [],
  lock = 0,
  dir = [],
  arrowHelper = [];
let addModal = document.getElementById("add-modal");
let spanAddModal = document.getElementsByClassName("close")[1];

spanAddModal.onclick = function () {
  addModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === addModal) {
    addModal.style.display = "none";
  }
};

lockVertices.addEventListener("click", updateMouseButtons);
lockZoom.addEventListener("click", updateMouseButtons);
lockRotate.addEventListener("click", updateMouseButtons);

function updateMouseButtons() {
  let leftMouse = MOUSE.PAN; // Default behavior (panning with left mouse)
  let middleMouse = MOUSE.PAN; // Set middle mouse to MOUSE.PAN but it will do nothing
  let rightMouse = MOUSE.ROTATE; // Default behavior (rotation with right mouse)

  // If lockVertices is checked, disable LEFT (no panning)
  if (lockVertices.checked) {
    leftMouse = null; // Disable left mouse button (no panning)
  }

  // If lockZoom is checked, prevent MIDDLE (no zooming)
  if (lockZoom.checked) {
    middleMouse = null; // Disable middle mouse button (no zooming)
    orbit.enableZoom = false; // Disable zoom functionality
  } else {
    orbit.enableZoom = true; // Enable zoom if lockZoom is unchecked
  }

  // If lockRotate is checked, disable RIGHT (no rotating)
  if (lockRotate.checked) {
    rightMouse = null; // Disable right mouse button (no rotating)
  }

  // Update the mouse buttons based on the checkbox states
  orbit.mouseButtons = {
    LEFT: leftMouse,
    MIDDLE: middleMouse,
    RIGHT: rightMouse,
  };

  // Ensure smooth damping and set target
  orbit.target.set(0, 0, 0);
  orbit.dampingFactor = 0.05;
  orbit.enableDamping = true;

  // Force an update on the controls
  orbit.update();
}

xyGrid.addEventListener("click", () => {
  if (xyGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 1, 0);
    grid.lookAt(vector3);
    xygrid.push(grid);
    scene.add(xygrid[0]);
  } else {
    scene.remove(xygrid[0]);
    xygrid.pop();
  }
});
xzGrid.addEventListener("click", () => {
  if (xzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 0, 1);
    grid.lookAt(vector3);
    xzgrid.push(grid);
    scene.add(xzgrid[0]);
  } else {
    scene.remove(xzgrid[0]);
    xzgrid.pop();
  }
});
yzGrid.addEventListener("click", () => {
  if (yzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(PI / 2);
    // grid.lookAt(vector3);
    yzgrid.push(grid);
    scene.add(yzgrid[0]);
  } else {
    scene.remove(yzgrid[0]);
    yzgrid.pop();
  }
});

function updateShapeList(shapeList) {
  const shapeListDiv = document.getElementById("shape-list");
  shapeListDiv.innerHTML = ""; // Clear previous list

  const ul = document.createElement("ul");

  shapeList.forEach((shape) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="shape-info">
        <span class="shape-id">${shape.id}</span>
        <span class="coordinates">(${shape.x.toFixed(2)}, ${shape.y.toFixed(2)}, ${shape.z.toFixed(2)})</span>
      </div>
      <div class="button-group">
        <button class="select-btn" 
                data-name="${shape.id}" 
                data-coordinates="${shape.x.toFixed(2)},${shape.y.toFixed(2)},${shape.z.toFixed(2)}">
          Select
        </button>
        
      </div>
    `;
    ul.appendChild(li);
  });

  shapeListDiv.appendChild(ul);

  // Attach event listeners for Select, Edit, and Delete buttons
  document.querySelectorAll(".select-btn").forEach((button) => {
    button.addEventListener("click", handleSelect, false);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", handleEdit, false);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", handleDelete, false);
  });
}

// Shape selection handler
function handleSelect(event) {
  console.log('Select button clicked:', event.target.dataset.name);
  const shapeId = event.target.dataset.name;
  
  // Find shape by ID in both shapes array and shapeList
  const selectedShape = shapes.find(shape => shape.userData.id === shapeId);
  const selectedShapeInfo = shapeList.find(shape => shape.id === shapeId);
  
  console.log('Found shape:', selectedShape);
  console.log('Found shape info:', selectedShapeInfo);
  
  if (selectedShape) {
    console.log('Deselecting all shapes');
    // Deselect all shapes
    shapes.forEach(shape => {
      shape.userData.selected = false;
      if (shape.userData.outline) {
        shape.remove(shape.userData.outline);
        shape.userData.outline = null;
      }
    });

    console.log('Selecting shape:', shapeId);
    // Select the clicked shape
    selectedShape.userData.selected = true;
    
    // Create outline based on shape type
    let outlineGeometry;
    switch(selectedShape.name) {
      case 'Cube':
        outlineGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
        break;
      case 'Tetrahedron':
        outlineGeometry = new THREE.TetrahedronGeometry(1.2);
        break;
      case 'Octahedron':
        outlineGeometry = new THREE.OctahedronGeometry(1.2);
        break;
      default:
        outlineGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    }
    
    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.5
    });
    
    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    selectedShape.add(outline);
    selectedShape.userData.outline = outline;

    // Update edit modal with shape's current position
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');
    const zInput = document.getElementById('z');
    
    // Set the input values with explicit string conversion
    xInput.value = selectedShape.position.x.toString();
    yInput.value = selectedShape.position.y.toString();
    zInput.value = selectedShape.position.z.toString();
    
    console.log('Updated modal values:', {
      x: xInput.value,
      y: yInput.value,
      z: zInput.value
    });
    
    document.getElementById('shape-edit-dropdown').value = selectedShape.name;

    // Update button state
    const selectBtn = event.target;
    selectBtn.classList.add('shape-selected');
    selectBtn.textContent = 'Selected';
    console.log('Shape selection complete');
  } else {
    console.warn('Shape not found for ID:', shapeId);
  }
}

function handleDelete(shape, line, coordsArray) {
  // Remove the selected shape and line from the scene
  shapeList = shapeList.filter(
    (s) =>
      !(s.x == coordsArray[0] && s.y == coordsArray[1] && s.z == coordsArray[2])
  );

  shapes = shapes.filter(
    (s) =>
      !(
        s.position.x == coordsArray[0] &&
        s.position.y == coordsArray[1] &&
        s.position.z == coordsArray[2]
      )
  );
  scene.remove(line);
  scene.remove(shape);

  // Remove the shape from the shapeList based on coordinates

  updateShapeList(shapeList);
  console.log(`Shape deleted.`);
}

function handleEdit(shape, line, coordsArray) {
  console.log('Edit started');
  
  // Clear any existing event listeners
  modalEditButton.removeEventListener("click", handleEditConfirmation);

  // Show the modal
  editModal.style.display = "block";

  // Fill the modal fields with the current values of the shape
  const shapeTypeSelect = document.querySelector("select");
  const xInput = document.getElementById("x");
  const yInput = document.getElementById("y");
  const zInput = document.getElementById("z");

  // Set the input values with explicit string conversion
  xInput.value = shape.position.x.toString();
  yInput.value = shape.position.y.toString();
  zInput.value = shape.position.z.toString();
  shapeTypeSelect.value = shape.name;

  console.log('Initial modal values:', {
    x: xInput.value,
    y: yInput.value,
    z: zInput.value
  });

  // Add the event listener
  modalEditButton.addEventListener("click", handleEditConfirmation);
  console.log('Edit setup completed');
}

let buttons = document.getElementsByTagName("button");
const size = 50;
const divisions = 25;

document.getElementById("add-shape-btn").onclick = function () {
  addModal.style.display = "block";

  // First, remove any existing event listener before adding a new one
  modalbutton2.removeEventListener("click", handleShapeAddition);

  // Add the event listener for the modal button
  modalbutton2.addEventListener("click", handleShapeAddition);
};

// Function to handle shape addition
function handleShapeAddition() {
  // Parse coordinates as numbers and validate
  const xcoord = parseFloat(document.getElementById("x1").value);
  const ycoord = parseFloat(document.getElementById("y1").value);
  const zcoord = parseFloat(document.getElementById("z1").value);
  
  // Validate coordinates
  if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
    console.error("Invalid coordinate input:", { x: xcoord, y: ycoord, z: zcoord });
    alert('Please enter valid numeric coordinates');
    return;
  }

  noOfShapes++;
  const shapeType = document.getElementById("shape-add-dropdown").value;

  // Create shape with formatted coordinates
  const newShape = {
    id: `${shapeType}-${shapeCount[shapeType === 'Cube' ? 0 : shapeType === 'Tetrahedron' ? 1 : 2]}`,
    x: parseFloat(xcoord.toFixed(2)),
    y: parseFloat(ycoord.toFixed(2)),
    z: parseFloat(zcoord.toFixed(2)),
    type: shapeType
  };

  if (shapeType === "Cube") {
    createCube(
      newShape.x,
      newShape.y,
      newShape.z,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  } else if (shapeType === "Tetrahedron") {
    createTetrahedron(
      newShape.x,
      newShape.y,
      newShape.z,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  } else if (shapeType === "Octahedron") {
    createOctahedron(
      newShape.x,
      newShape.y,
      newShape.z,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragz
    );
  }
  updateShapeList(shapeList); // Update the UI
  addModal.style.display = "none";
}

let point = [];
let shapeVertex = [];
let noOfShapes = 0;

// document.addEventListener("pointermove", (event) => {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//   raycaster.setFromCamera(mouse, camera);
//   if (isDragging && lock === 0) {
//     for (let i = 0; i < shapes.length; i++) {
//       raycaster.ray.intersectPlane(plane, planeIntersect);
//       shapes[i].geometry.vertices[0].set(
//         planeIntersect.x + shift.x,
//         planeIntersect.y + shift.y,
//         planeIntersect.z + shift.z
//       );
//       shapes[i].geometry.verticesNeedUpdate = true;
//       shapeVertex
// [i].position.set(
//         planeIntersect.x + shift.x - dragX[i],
//         planeIntersect.y + shift.y - dragY[i],
//         planeIntersect.z + shift.z - dragZ[i]
//       );
//     }

//   } else if (isDragging) {
//     raycaster.ray.intersectPlane(plane, planeIntersect);
//   }
// });
// document.addEventListener("pointerdown", () => {
//   switch (event.which) {
//     case 1:
//       //  Left mouse button pressed
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//       pNormal.copy(camera.position).normalize();
//       plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
//       raycaster.setFromCamera(mouse, camera);
//       raycaster.ray.intersectPlane(plane, planeIntersect);
//       shift.subVectors(dotList[0].geometry.getAttribute('position').array, planeIntersect);
//       isDragging = true;
//       dragObject = shapes[shapes.length - 1];
//       break;
//   }
// });
// document.addEventListener("pointerup", () => {
//   isDragging = false;
//   dragObject = null;
// });

let xcomp = 1,
  ycomp = 0,
  zcomp = 0;
let rot_axis = new THREE.Vector3(1, 0, 0); // Default to X-axis
let present_theta = 0;
let total_angle = 45; // Default angle
const set_rotation_axis = document.getElementById("set-rotation-axis");
rot_axis.normalize();
set_rotation_axis.addEventListener("click", () => {
  console.log('Change Axis button clicked');
  
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }

  // Get rotation values from form
  const theta = parseFloat(document.getElementById("theta").value);
  const axis = document.getElementById("axis-change-dropdown").value;
  
  console.log('Rotation parameters:', {
    theta: theta,
    axis: axis
  });
  
  // Set rotation axis based on selection
  if (axis === "0") { // X-axis
    rot_axis.set(1, 0, 0);
  } else if (axis === "1") { // Y-axis
    rot_axis.set(0, 1, 0);
  } else if (axis === "2") { // Z-axis
    rot_axis.set(0, 0, 1);
  }
  rot_axis.normalize();
  
  console.log('Rotation axis:', rot_axis);
  
  // Set current transformation type
  currentTransformationType = 'rotation';
  
  // Reset slider to start position
  if (slider) {
    slider.value = 0;
  }
  
  // Update the matrix display with initial state
  updateMatrixDisplay();
});

// Add transformation type tracking
let currentTransformationType = null; // 'translation', 'rotation', or 'scaling'

// Apply Translation function
function applyTranslation(event) {
  event.preventDefault();
  console.log('Applying translation');
  
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }
  
  // Store original position
  const originalPosition = selectedShape.position.clone();
  console.log('Original position:', originalPosition);
  
  // Get translation values from form
  transX = parseFloat(document.getElementById("trans-x").value);
  transY = parseFloat(document.getElementById("trans-y").value);
  transZ = parseFloat(document.getElementById("trans-z").value);

  console.log('Translation values:', {
    x: transX,
    y: transY,
    z: transZ
  });
  
  // Store initial position for slider animation
  old_position = [originalPosition.x, originalPosition.y, originalPosition.z];
  
  // Set current transformation type
  currentTransformationType = 'translation';
  
  // Reset slider to start position
  if (slider) {
    slider.value = 0;
  }
  
  // Update the matrix display with initial state
  updateMatrixDisplay();
}

// Apply Scaling function
function applyScaling(event) {
  event.preventDefault();
  console.log('Applying scaling');
  
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }
  
  // Store original position and scale
  const originalPosition = selectedShape.position.clone();
  const originalScale = selectedShape.scale.clone();
  console.log('Original position:', originalPosition);
  console.log('Original scale:', originalScale);
  
  // Get scaling values from form
  max_x_scale = parseFloat(document.getElementById("scale-x").value);
  max_y_scale = parseFloat(document.getElementById("scale-y").value);
  max_z_scale = parseFloat(document.getElementById("scale-z").value);

  console.log('Target scaling values:', {
    x: max_x_scale,
    y: max_y_scale,
    z: max_z_scale
  });
  
  // Store initial scale for slider animation
  old_scale = [originalScale.x, originalScale.y, originalScale.z];
  
  // Set current transformation type
  currentTransformationType = 'scaling';
  
  // Reset slider to start position
  if (slider) {
    slider.value = 0;
  }
  
  // Update the matrix display with initial state
  updateMatrixDisplay();
}

// Apply Rotation function
function applyRotation(event) {
  event.preventDefault();
  console.log('Applying rotation');
  
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }
  
  console.log('Selected shape for rotation:', selectedShape);
  console.log('Shape position:', selectedShape.position);
  console.log('Shape geometry:', selectedShape.geometry);
  
  // Get rotation values from form
  const theta = parseFloat(document.getElementById("theta").value);
  const axis = document.getElementById("axis-change-dropdown").value;
  
  console.log('Rotation parameters:', {
    theta: theta,
    axis: axis
  });
  
  // Set rotation axis based on selection
  let rot_axis;
  if (axis === "0") { // X-axis
    rot_axis = new THREE.Vector3(1, 0, 0);
  } else if (axis === "1") { // Y-axis
    rot_axis = new THREE.Vector3(0, 1, 0);
  } else if (axis === "2") { // Z-axis
    rot_axis = new THREE.Vector3(0, 0, 1);
  }
  rot_axis.normalize();
  
  console.log('Rotation axis:', rot_axis);
  
  // Store initial rotation for slider animation
  present_theta = 0;
  
  // Set current transformation type
  currentTransformationType = 'rotation';
  
  // Reset slider to start position
  if (slider) {
    slider.value = 0;
  }
  
  // Update the matrix display with initial state
  updateMatrixDisplay();
}

function movePoint(e) {
  console.log('Slider moved:', e.target.value);
  const sliderValue = parseFloat(e.target.value) / 1000;
  console.log('Normalized slider value:', sliderValue);
  
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }

  console.log('Selected shape for transformation:', selectedShape);
  console.log('Current transformation type:', currentTransformationType);

  // Handle different transformation types
  switch(currentTransformationType) {
    case 'translation':
      // Calculate new position based on slider value
      const newX = old_position[0] + transX * sliderValue;
      const newY = old_position[1] + transY * sliderValue;
      const newZ = old_position[2] + transZ * sliderValue;
      
      // Create translation matrix
      const translationMatrix = new THREE.Matrix4();
      translationMatrix.set(
        1, 0, 0, transX * sliderValue,
        0, 1, 0, transY * sliderValue,
        0, 0, 1, transZ * sliderValue,
        0, 0, 0, 1
      );
      
      // Apply the transformation
      selectedShape.position.set(newX, newY, newZ);
      selectedShape.updateMatrix();
      
      // Update transformation matrix
      trans_matrix.copy(translationMatrix);
      
      // Update shapeList entry
      const shapeInfo = shapeList.find(s => s.id === selectedShape.userData.id);
      if (shapeInfo) {
        shapeInfo.x = parseFloat(selectedShape.position.x.toFixed(2));
        shapeInfo.y = parseFloat(selectedShape.position.y.toFixed(2));
        shapeInfo.z = parseFloat(selectedShape.position.z.toFixed(2));
      }
      break;
      
    case 'scaling':
      // Calculate new scale based on slider value
      const newScaleX = old_scale[0] + (max_x_scale - old_scale[0]) * sliderValue;
      const newScaleY = old_scale[1] + (max_y_scale - old_scale[1]) * sliderValue;
      const newScaleZ = old_scale[2] + (max_z_scale - old_scale[2]) * sliderValue;
      
      // Create scaling matrix
      const scalingMatrix = new THREE.Matrix4();
      scalingMatrix.set(
        newScaleX, 0, 0, 0,
        0, newScaleY, 0, 0,
        0, 0, newScaleZ, 0,
        0, 0, 0, 1
      );
      
      // Apply the transformation
      selectedShape.scale.set(newScaleX, newScaleY, newScaleZ);
      selectedShape.updateMatrix();
      
      // Update transformation matrix
      trans_matrix.copy(scalingMatrix);
      break;
      
    case 'rotation':
      // Get rotation angle from form
      const theta = parseFloat(document.getElementById("theta").value);
      const axis = document.getElementById("axis-change-dropdown").value;
      
      console.log('Rotation parameters:', {
        theta: theta,
        axis: axis,
        sliderValue: sliderValue
      });
      
      // Calculate rotation angle based on slider
      const rot_angle = theta * sliderValue;
      console.log('Rotation angle:', rot_angle);
      
      // Convert angle to radians
      const rot_angle_rad = (rot_angle * Math.PI) / 180;
      
      // Apply rotation based on selected axis
      if (axis === "0") { // X-axis
        selectedShape.rotation.x = rot_angle_rad;
      } else if (axis === "1") { // Y-axis
        selectedShape.rotation.y = rot_angle_rad;
      } else if (axis === "2") { // Z-axis
        selectedShape.rotation.z = rot_angle_rad;
      }
      
      // Create rotation matrix for display
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationAxis(rot_axis, rot_angle_rad);
      
      // Update transformation matrix
      trans_matrix.copy(rotationMatrix);
      break;
  }
  
  // Update matrix display
  updateMatrixDisplay();
  
  // Update shape list display
  updateShapeList(shapeList);
}

// Function to update matrix display
function updateMatrixDisplay() {
  document.getElementById("matrix-00").value = trans_matrix.elements[0];
  document.getElementById("matrix-01").value = trans_matrix.elements[1];
  document.getElementById("matrix-02").value = trans_matrix.elements[2];
  document.getElementById("matrix-03").value = trans_matrix.elements[12];

  document.getElementById("matrix-10").value = trans_matrix.elements[4];
  document.getElementById("matrix-11").value = trans_matrix.elements[5];
  document.getElementById("matrix-12").value = trans_matrix.elements[6];
  document.getElementById("matrix-13").value = trans_matrix.elements[13];

  document.getElementById("matrix-20").value = trans_matrix.elements[8];
  document.getElementById("matrix-21").value = trans_matrix.elements[9];
  document.getElementById("matrix-22").value = trans_matrix.elements[10];
  document.getElementById("matrix-23").value = trans_matrix.elements[14];

  document.getElementById("matrix-30").value = trans_matrix.elements[3];
  document.getElementById("matrix-31").value = trans_matrix.elements[7];
  document.getElementById("matrix-32").value = trans_matrix.elements[11];
  document.getElementById("matrix-33").value = trans_matrix.elements[15];
}

// Function to reset matrix to identity
function resetMatrixToIdentity() {
  trans_matrix.set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
  updateMatrixDisplay();
}

function createLabel(text, direction, length) {
  const fontLoader = new THREE.FontLoader();
  let labelMesh;

  fontLoader.load(
    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: 0.6,
        height: 0.1,
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      labelMesh = new THREE.Mesh(geometry, material);

      // Position the label at the end of the arrow (tip of the arrow)
      const labelPosition = direction.clone().multiplyScalar(length);
      labelMesh.position.copy(labelPosition);
      scene.add(labelMesh);
    }
  );

  return labelMesh;
}

const toggleInstructions = document.getElementById("toggle-instructions");
const procedureMessage = document.getElementById("procedure-message");

// Function to show the instructions overlay
const showInstructions = () => {
  procedureMessage.style.display = "block";
};

// Function to hide the instructions overlay
const hideInstructions = (event) => {
  // Close if click is outside the overlay or if it's the toggle button again
  if (
    !procedureMessage.contains(event.target) &&
    event.target !== toggleInstructions
  ) {
    procedureMessage.style.display = "none";
  }
};

// Attach event listeners
toggleInstructions.addEventListener("click", (event) => {
  // Toggle the visibility of the overlay
  if (procedureMessage.style.display === "block") {
    procedureMessage.style.display = "none";
  } else {
    showInstructions();
  }
  event.stopPropagation(); // Prevent immediate closure after clicking the button
});

document.addEventListener("click", hideInstructions);

// Prevent closing the overlay when clicking inside it
procedureMessage.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the click inside from closing the overlay
});

// Add event listeners for transformation forms
document.addEventListener('DOMContentLoaded', function() {
  // Translation form
  const translationForm = document.getElementById("translation-form");
  if (translationForm) {
    translationForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent form submission
      applyTranslation(event);
    });
  }

  // Scaling form
  const scalingForm = document.getElementById("scaling-form");
  if (scalingForm) {
    scalingForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent form submission
      applyScaling(event);
    });
  }

  // Rotation form
  const rotationForm = document.getElementById("rotation-form");
  if (rotationForm) {
    rotationForm.addEventListener("submit", function(event) {
      event.preventDefault();
      console.log('Rotation form submitted');
      
      // Check if any shape is selected
      const selectedShape = shapes.find(shape => shape.userData.selected);
      if (!selectedShape) {
        console.warn('No shape selected');
        alert("Please select a shape first");
        return;
      }
      
      // Get rotation values from form
      total_angle = parseFloat(document.getElementById("theta").value);
      const axis = document.getElementById("axis-change-dropdown").value;
      
      // Set rotation axis based on selection
      if (axis === "0") { // X-axis
        rot_axis.set(1, 0, 0);
      } else if (axis === "1") { // Y-axis
        rot_axis.set(0, 1, 0);
      } else if (axis === "2") { // Z-axis
        rot_axis.set(0, 0, 1);
      }
      rot_axis.normalize();
      
      // Reset rotation state
      present_theta = 0;
      
      // Reset shape rotation
      selectedShape.rotation.set(0, 0, 0);
      
      // Set current transformation type
      currentTransformationType = 'rotation';
      
      // Reset slider to start position
      if (slider) {
        slider.value = 0;
      }
      
      // Update the matrix display with initial state
      updateMatrixDisplay();
    });
  }

  // Initialize matrix display
  resetMatrixToIdentity();

  // Select the reset button
  const resetBtn = document.getElementById("reset-all-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetAllFields);
  }

  // Add event listener for edit button
  const editShapeBtn = document.getElementById('edit-shape-btn');
  if (editShapeBtn) {
    editShapeBtn.addEventListener('click', function() {
      console.log('Edit button clicked');
      window.editShape();
    });
  }
});

// Function to reset all fields
function resetAllFields() {
  // Clear all shapes
  shapes.forEach(shape => {
    scene.remove(shape);
  });
  shapes = [];
  shapeList = [];
  
  // Reset shape counts
  shapeCount = [0, 0, 0, 0];
  
  // Reset transformation matrix
  trans_matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  updateMatrixDisplay();
  
  // Reset slider
  if (slider) {
    slider.value = 0;
  }
  
  // Reset current transformation type
  currentTransformationType = null;
  
  // Create initial shapes
  createCube(
    5, 1, 0,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createTetrahedron(
    4, 5, 2,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createOctahedron(
    3, 3, 3,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );
  
  // Update shape list
  updateShapeList(shapeList);
}

scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
let init = function () {
  // Set up camera
  camera.position.set(25, 25, 25);
  camera.lookAt(10, 10, 5);

  // Add lighting
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Set up axis arrows
  const dir = [
    new THREE.Vector3(1, 0, 0),  // +X
    new THREE.Vector3(0, 1, 0),  // +Y
    new THREE.Vector3(0, 0, 1),  // +Z
    new THREE.Vector3(-1, 0, 0), // -X
    new THREE.Vector3(0, -1, 0), // -Y
    new THREE.Vector3(0, 0, -1)  // -Z
  ];

  const labels = ["+X", "+Y", "+Z", "-X", "-Y", "-Z"];
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;

  // Create axis arrows and labels
  for (let i = 0; i < 6; i++) {
    let color;
    if (i === 0 || i === 3) {
      color = "red";    // X axis
    } else if (i === 1 || i === 4) {
      color = "yellow"; // Y axis
    } else {
      color = "blue";   // Z axis
    }

    arrowHelper[i] = new THREE.ArrowHelper(dir[i], origin, length, color);
    scene.add(arrowHelper[i]);

    // Create and add labels
    const label = createLabel(labels[i], dir[i], length);
    if (label) {
    scene.add(label);
    }
  }

  // Create initial shapes
  createCube(
    5, 1, 0,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createTetrahedron(
    4, 5, 2,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  createOctahedron(
    3, 3, 3,
    shapes,
    shapeList,
    shapeCount,
    scene,
    point,
    shapeVertex,
    dragX,
    dragY,
    dragz
  );

  // Update shape list
  updateShapeList(shapeList);

  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  renderer.setSize(w, 0.83 * h);
  container.appendChild(renderer.domElement);

  // Set up orbit controls
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.mouseButtons = {
    LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE
  };
  orbit.target.set(0, 0, 0);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.05;
  orbit.update();
};

let mainLoop = function () {
  orbit.update();
  camera.updateMatrixWorld();
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};

// Start the application
init();
mainLoop();

// Shape edit button handler
document.querySelector('.edit-button').addEventListener('click', function() {
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (selectedShape) {
    const x = parseFloat(document.getElementById('x').value);
    const y = parseFloat(document.getElementById('y').value);
    const z = parseFloat(document.getElementById('z').value);

    // Validate coordinates
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      alert('Please enter valid numeric coordinates');
      return;
    }

    // Update shape position
    selectedShape.position.set(x, y, z);
    selectedShape.updateMatrix();
    
    // Update shapeList entry
    const index = shapes.indexOf(selectedShape);
    if (index !== -1) {
      shapeList[index].x = x;
      shapeList[index].y = y;
      shapeList[index].z = z;
    }

    // Update UI
    updateShapeList(shapeList);
    editModal.style.display = "none";
  }
});

// Edit shape button click handler
window.editShape = function() {
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    alert('Select a shape first');
    return;
  }
  
  // Fill the modal fields with current values
  document.getElementById('x').value = selectedShape.position.x;
  document.getElementById('y').value = selectedShape.position.y;
  document.getElementById('z').value = selectedShape.position.z;
  document.getElementById('shape-edit-dropdown').value = selectedShape.name;
  
  // Show the modal
  editModal.style.display = "block";
};
