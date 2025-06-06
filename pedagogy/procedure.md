## Overview
This experiment demonstrates 3D transformations including translation, rotation, and scaling in a 3D space. The simulation allows you to manipulate 3D shapes (Cube, Tetrahedron, and Octahedron) using various transformation controls.

## Step-by-Step Procedure

### 1. Initial Setup
- The simulation starts with three default shapes: a Cube, a Tetrahedron, and an Octahedron
- Each shape is positioned at different coordinates in 3D space
- The coordinate system is displayed with colored axes (Red for X, Yellow for Y, Blue for Z)

### 2. Shape Selection
1. Click the "Select" button next to any shape in the shape list
2. The selected shape will be highlighted with a yellow outline
3. Only one shape can be selected at a time
4. The shape's current position will be displayed in the edit modal

### 3. Rotation Transformation
1. Select a shape using the "Select" button
2. In the Rotation Controls section:
   - Choose the rotation axis (X, Y, or Z) from the dropdown menu
   - Enter the desired rotation angle ($\theta$) in degrees
   - Click "Change Axis" to set the rotation axis
3. Use the slider to control the rotation:
   - Moving the slider from 0 to 1000 will rotate the shape from 0° to the specified angle
   - The rotation will be smooth and continuous
   - The transformation matrix will update in real-time
4. The rotation follows the right-hand rule:
   - X-axis rotation: Counter-clockwise when looking from positive X
   - Y-axis rotation: Counter-clockwise when looking from positive Y
   - Z-axis rotation: Counter-clockwise when looking from positive Z

### 4. Translation Transformation
1. Select a shape using the "Select" button
2. In the Translation Vector section:
   - Enter the desired X, Y, and Z translation values
   - Click "Apply Translation" to set the translation vector
3. Use the slider to control the translation:
   - Moving the slider from 0 to 1000 will move the shape from its original position to the target position
   - The movement will be smooth and continuous
   - The transformation matrix will update in real-time

### 5. Scaling Transformation
1. Select a shape using the "Select" button
2. In the Scaling Controls section:
   - Enter the desired X, Y, and Z scaling factors
   - Click "Apply Scaling" to set the scaling factors
3. Use the slider to control the scaling:
   - Moving the slider from 0 to 1000 will scale the shape from its original size to the target size
   - The scaling will be smooth and continuous
   - The transformation matrix will update in real-time

### 6. Additional Controls
- Use the grid checkboxes to toggle the visibility of XY, YZ, and XZ grids
- Use the lock options to restrict mouse interactions:
  - Lock Graph: Prevents translation
  - Lock Zoom: Prevents zooming
  - Lock Rotate: Prevents rotation
- Click "Reset All" to return all shapes to their initial positions and reset all transformations

### 7. Transformation Matrix
- The 4x4 transformation matrix is displayed in real-time
- It shows the current transformation being applied to the selected shape
- The matrix updates as you move the slider
- The matrix components represent:
  - Top 3x3: Rotation and scaling
  - Last column: Translation
  - Last row: [0, 0, 0, 1] for affine transformations

## Notes
- Always ensure the slider is at zero before making new transformations
- The shape must be selected before applying any transformation
- The transformation matrix helps visualize the mathematical representation of the transformations
- The right-hand rule is used for rotation directions to maintain consistency 