import { useGSAP } from '@gsap/react'
import { Environment, Lightformer, View } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { yellowImg } from '../utils'
import PhoneModelView from './PhoneModelView'
import { phoneModels, phoneSizes } from '../constants'
import { animateWithGsapTimeline } from '../utils/animations'

/**
 * PhoneModel - Main section component for the 3D iPhone model showcase.
 *
 * Renders two side-by-side phone model views (small and large) within a shared
 * R3F Canvas. Users can switch between model sizes and color variants using the
 * UI controls below the 3D viewport.
 *
 * Architecture:
 * - PhoneModel (this component) owns the Canvas and shared Environment lighting.
 * - PhoneModelView renders each individual model inside a drei `View`, enabling
 *   multiple viewports within a single Canvas.
 * - IPhone renders the actual GLTF model with dynamic textures and materials.
 * - Lights provides per-view spotlight lighting.
 *
 * GSAP is used for size-switch animations (sliding views in/out) and scroll-
 * triggered heading reveals.
 */
const PhoneModel = () => {
  const [modelSize, setModelSize] = useState('small')
  const [phoneModelInfo, setPhoneModelInfo] = useState({
    title: '',
    color: ['#8f8a81', '#ffe7b9', '#6f6c64'],
    img: yellowImg,
  })

  // camera control for model view
  const cameraControlSmall = useRef(null);
  const cameraControlLarge = useRef(null);

  // phone models
  const smallPhoneModel = useRef(new THREE.Group())
  const largePhoneModel = useRef(new THREE.Group())

  // model rotation
  const [smallModelRotation, setSmallModelRotation] = useState(0)
  const [largeModelRotation, setLargeModelRotation] = useState(0)

  const timeline = gsap.timeline()

  useEffect(() => {
    if (modelSize === 'large') {
      animateWithGsapTimeline(timeline, smallPhoneModel, smallModelRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2,
      })
    }

    if (modelSize === 'small') {
      animateWithGsapTimeline(timeline, largePhoneModel, largeModelRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2,
      })
    }
  }, [modelSize])


  useGSAP(() => {
    gsap.to('#heading', {
      y: 0,
      opacity: 1,
    })
  }, [])

  return (
    <section className='common-padding'>
      <div className='screen-max-width'>
        <h1 id='heading' className='section-heading'>
          Take a closer look.
        </h1>

        <div className='flex flex-col items-center mt-5'>
          <div className='w-full h-[75vh] md:h-[90vh] overflow-hidden relative'>
            <PhoneModelView
              index={1}
              groupRef={smallPhoneModel}
              gsapType='view1'
              controlRef={cameraControlSmall}
              setRotationState={setSmallModelRotation}
              item={phoneModelInfo}
              size={modelSize}
            />
            <PhoneModelView
              index={2}
              groupRef={largePhoneModel}
              gsapType='view2'
              controlRef={cameraControlLarge}
              setRotationState={setLargeModelRotation}
              item={phoneModelInfo}
              size={modelSize}
            />

            {/*
              R3F Canvas — a single Canvas is shared by both PhoneModelView
              components via drei's View / View.Port pattern. This avoids
              creating multiple WebGL contexts (browsers typically limit these).
            */}
            <Canvas
              className='w-full h-full'
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden',
              }}
              // eventSource allows pointer events from outside the Canvas (e.g. the root div)
              // to be forwarded into the 3D scene, enabling OrbitControls interaction.
              eventSource={document.getElementById('root') ?? undefined}
            >
              {/*
                Environment is placed at the Canvas level so that ONE environment
                map is shared across all Views. Previously each PhoneModelView had
                its own <Environment>, which generated a separate HDR cube map per
                view — doubling GPU memory usage and causing WebGL Context Lost
                errors. Keeping it here ensures a single environment map is created
                and reused by every view rendered through View.Port.

                resolution={256} keeps the environment cube map small (256x256 per
                face) to reduce GPU memory pressure.
              */}
              <Environment resolution={256}>
                <group>
                  <Lightformer
                    form="rect"
                    intensity={10}
                    position={[-1, 0, -10]}
                    scale={10}
                    color={"#495057"}
                  />
                  <Lightformer
                    form="rect"
                    intensity={10}
                    position={[-10, 2, 1]}
                    scale={10}
                    rotation-y={Math.PI / 2}
                  />
                  <Lightformer
                    form="rect"
                    intensity={10}
                    position={[10, 0, 1]}
                    scale={10}
                    rotation-y={Math.PI / 2}
                  />
                  <Lightformer
                    form="rect"
                    intensity={12}
                    position={[0, 10, 1]}
                    scale={10}
                    rotation-x={Math.PI / 2}
                  />
                  <Lightformer
                    form="rect"
                    intensity={12}
                    position={[0, -10, 1]}
                    scale={10}
                    rotation-x={-Math.PI / 2}
                  />
                </group>
              </Environment>
              {/* Render multiple views of a model in a canvas, helps with model animations */}
              <View.Port />
            </Canvas>
          </div>
          <div className='mx-auto w-full'>
            <p className='text-sm font-light text-center mb-5'>{phoneModelInfo.title}</p>
            <div className='flex-center'>
              <ul className='color-container'>
                {
                  phoneModels.map((phoneModel, i) => (
                    <li
                      key={i}
                      className='w-6 h-6 rounded-full mx-2 cursor-pointer'
                      style={{
                        backgroundColor: phoneModel.color[0],
                      }}
                      onClick={() => setPhoneModelInfo(phoneModel)}
                    />
                  ))
                }
              </ul>
              <button className='size-btn-container'>
                {phoneSizes.map(({ label, value }) => (
                  <span
                    key={label}
                    className='size-btn cursor-pointer'
                    style={{
                      backgroundColor: modelSize === value ? 'white' : 'transparent',
                      color: modelSize === value ? 'black' : 'white',
                    }}
                    onClick={() => setModelSize(value)}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhoneModel