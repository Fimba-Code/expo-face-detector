import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import * as THREE from 'three';
import ExpoTHREE from 'expo-three'
import { GLView } from 'expo-gl';
import * as Permissions from 'expo-permissions';
import * as ThreeAR from 'expo-three-ar';


export default class App extends Component {

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('camera permission required');
    }
    // Turn off extra warnings
    // ExpoTHREE.THREE.suppressExpoWarnings(true);
  }

  _onGLContextCreate = async (gl) => {
    // const arSession = await this._glView.startARSessionAsync()
    // new ExpoTHREE.AR.Camera

    // Do graphics stuff here!
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    const renderer = new ExpoTHREE.Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    scene.background = new ThreeAR.BackgroundTexture(renderer)

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x828282 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube)
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
      cube.rotation.x += 0.07;
      cube.rotation.y += 0.04;
    }

    animate();
  }
  render() {
    return (
      <React.Fragment>

        <GLView
          style={{ flex: 1 }}
          ref={(ref) => this._glView = ref}
          onContextCreate={this._onGLContextCreate}
        />

      </React.Fragment >
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    padding: 5,
    backgroundColor: Platform.OS === 'ios' ? 'red' : 'blue',
    color: '#fff',
    borderRadius: 5,
  }
});
