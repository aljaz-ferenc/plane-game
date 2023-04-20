export function movePlane(plane, planePosition, camera, movePlaneDown, movePlaneUp, movePlaneLeft, movePlaneRight){
    plane.position.z -= 0.3
    planePosition = plane.position.z
    camera.position.z -= 0.3
    if(movePlaneUp && plane.rotation.x > 0.3){
      plane.position.y += 0.06
    }
    if(movePlaneDown && plane.rotation.x < -0.3){
      plane.position.y -= 0.06
    }
    if(movePlaneLeft && plane.rotation.z > 0.3){
      plane.position.x -= 0.06
    }
    if(movePlaneRight && plane.rotation.z < -0.3){
      plane.position.x += 0.06
    }
  }
  
  export function rotatePlane(plane, rotatePlaneDown, rotatePlaneUp, rotatePlaneLeft, rotatePlaneRight) {
    if (plane) {
      if (rotatePlaneLeft && plane.rotation.z <= 1) {
        plane.rotation.z += 0.05
      }
      else if (plane.rotation.z >= 1) {
        plane.rotation.z === 1
      }
      if (!rotatePlaneLeft && plane.rotation.z > 0) {
        plane.rotation.z -= 0.05
      }
  
  
      if (rotatePlaneRight && plane.rotation.z >= -1) {
        plane.rotation.z -= 0.05
      }
      else if (plane.rotation.z <= -1) {
        plane.rotation.z === 1
      }
      if (!rotatePlaneRight && plane.rotation.z < 0) {
        plane.rotation.z += 0.05
      }
  
      if (rotatePlaneDown && plane.rotation.x >= -0.5) {
        plane.rotation.x -= 0.05
      }
      else if (plane.rotation.x <= 0.5) {
        plane.rotation.x === 0.5
      }
      if (!rotatePlaneDown && plane.rotation.x < 0) {
        plane.rotation.x += 0.05
      }
  
      if (rotatePlaneUp && plane.rotation.x <= 0.5) {
        plane.rotation.x += 0.05
      }
      else if (plane.rotation.x >= 0.5) {
        plane.rotation.x === 0.5
      }
      if (!rotatePlaneUp && plane.rotation.x > 0) {
        plane.rotation.x -= 0.05
      }
    }
  }