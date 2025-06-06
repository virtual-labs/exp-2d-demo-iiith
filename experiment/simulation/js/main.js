import { createCube, createOctahedron, createTetrahedron } from "./js/shapes.js";

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

  // Convert to numbers to ensure proper type
  const x = +xcoord;
  const y = +ycoord;
  const z = +zcoord;

  noOfShapes++;
  const shapeType = document.getElementById("shape-add-dropdown").value;
  let shapeCreated = false;

  switch(shapeType) {
    case 'Cube':
      shapeCreated = createCube(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;    
    case 'Octahedron':
      shapeCreated = createOctahedron(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;
    case 'Tetrahedron':
      shapeCreated = createTetrahedron(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;
  }

  if (shapeCreated) {
    updateShapeList(shapeList);
    modalAdd.style.display = "none";
  } else {
    alert('Failed to create shape. Please check the coordinates.');
  }
}

// Get the modal
const modalAdd = document.getElementById("addModal");
const modalEdit = document.getElementById("editModal");

// Get the button that opens the modal
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");

// Get the <span> element that closes the modal
const addSpan = document.getElementsByClassName("close")[0];
const editSpan = document.getElementsByClassName("close")[1];

// When the user clicks the button, open the modal
addBtn.onclick = function () {
  modalAdd.style.display = "block";
};

editBtn.onclick = function () {
  modalEdit.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
addSpan.onclick = function () {
  modalAdd.style.display = "none";
};

editSpan.onclick = function () {
  modalEdit.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modalAdd) {
    modalAdd.style.display = "none";
  }
  if (event.target == modalEdit) {
    modalEdit.style.display = "none";
  }
};

// Add event listener for the add button
document.querySelector('.add-button').addEventListener('click', function() {
  const shapeType = document.getElementById('shape-add-dropdown').value;
  // Parse coordinates as numbers and validate
  const x = Number(document.getElementById('x1').value);
  const y = Number(document.getElementById('y1').value);
  const z = Number(document.getElementById('z1').value);

  // Validate coordinates
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    alert('Please enter valid numeric coordinates');
    return;
  }

  let shapeCreated = false;
  switch(shapeType) {
    case 'Cube':
      shapeCreated = createCube(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;    
    case 'Octahedron':
      shapeCreated = createOctahedron(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;
    case 'Tetrahedron':
      shapeCreated = createTetrahedron(x, y, z, shapes, shapeList, shapeCount, scene, point, shapeVertex, dragX, dragY, dragZ);
      break;
  }

  if (shapeCreated) {
    updateShapeList(shapeList);
    modalAdd.style.display = "none";
  } else {
    alert('Failed to create shape. Please check the coordinates.');
  }
});

// Function to handle edit button click
function handleEdit(shape, line, coordsArray) {
  console.log('handleEdit called for shape:', shape.userData.id);
  const editModal = document.getElementById("edit-modal");
  if (!editModal) {
    console.error("Edit modal not found");
    return;
  }

  // Store the shape ID and coordinates
  editModal.dataset.shapeId = shape.userData.id;
  editModal.dataset.coords = JSON.stringify(coordsArray);
  console.log('Stored shape data in modal:', {
    id: shape.userData.id,
    coords: coordsArray
  });

  // Fill the modal fields
  document.getElementById("x").value = shape.position.x;
  document.getElementById("y").value = shape.position.y;
  document.getElementById("z").value = shape.position.z;
  document.getElementById("shape-edit-dropdown").value = shape.name;

  // Show the modal
  editModal.style.display = "block";
  console.log('Edit modal displayed');
}

// Function to handle edit confirmation
function handleEditConfirmation() {
  console.log('handleEditConfirmation called');
  const editModal = document.getElementById("edit-modal");
  if (!editModal) {
    console.error('Edit modal not found');
    return;
  }

  const shapeId = editModal.dataset.shapeId;
  const coordsArray = JSON.parse(editModal.dataset.coords);
  console.log('Processing edit for shape:', shapeId);
  
  // Get new values
  const xcoord = parseFloat(document.getElementById("x").value);
  const ycoord = parseFloat(document.getElementById("y").value);
  const zcoord = parseFloat(document.getElementById("z").value);
  const shapeType = document.getElementById("shape-edit-dropdown").value;

  console.log('New coordinates:', { x: xcoord, y: ycoord, z: zcoord, type: shapeType });

  if (isNaN(xcoord) || isNaN(ycoord) || isNaN(zcoord)) {
    console.error("Invalid coordinate input");
    alert('Please enter valid numeric coordinates');
    return;
  }

  // Find and remove the old shape
  const oldShape = shapes.find(s => s.userData.id === shapeId);
  if (oldShape) {
    console.log('Removing old shape');
    scene.remove(oldShape);
    shapes = shapes.filter(s => s.userData.id !== shapeId);
    shapeList = shapeList.filter(s => s.id !== shapeId);
  } else {
    console.warn('Old shape not found for ID:', shapeId);
  }

  // Create new shape
  const createShape = {
    Cube: createCube,
    Tetrahedron: createTetrahedron,
    Octahedron: createOctahedron
  }[shapeType];

  if (createShape) {
    console.log('Creating new shape of type:', shapeType);
    createShape(
      xcoord,
      ycoord,
      zcoord,
      shapes,
      shapeList,
      shapeCount,
      scene,
      point,
      shapeVertex,
      dragX,
      dragY,
      dragZ
    );
  } else {
    console.error('Invalid shape type:', shapeType);
  }

  updateShapeList(shapeList);
  editModal.style.display = "none";
  console.log('Edit operation complete');
}

// Add event listeners for edit and apply buttons
document.getElementById('edit-shape-btn').addEventListener('click', function() {
  console.log('Edit button clicked');
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }
  handleEdit(selectedShape, null, [selectedShape.position.x, selectedShape.position.y, selectedShape.position.z]);
});

document.getElementById('modalBox_addsubmit').addEventListener('click', function() {
  console.log('Apply button clicked');
  // Check if any shape is selected
  const selectedShape = shapes.find(shape => shape.userData.selected);
  if (!selectedShape) {
    console.warn('No shape selected');
    alert("Please select a shape first");
    return;
  }
  handleEditConfirmation();
}); 