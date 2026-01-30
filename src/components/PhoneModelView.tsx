import * as THREE from 'three'
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import Lights from './Lights'
import IPhone from './IPhone'
import { Suspense } from 'react'
import Loader from './Loader'

/**
 * PhoneModelView - Renders a single 3D iPhone viewport inside a drei View.
 *
 * Each View acts as a scissored sub-viewport within the shared Canvas defined
 * in PhoneModel. This component sets up its own camera, orbit controls, and
 * per-view spotlights, while the environment lighting is inherited from the
 * Canvas-level Environment in PhoneModel.
 *
 * Props:
 * - index:    1 for the small model, 2 for the large model. Also controls
 *             initial positioning (large view starts off-screen to the right).
 * - groupRef: Ref to the THREE.Group wrapping the IPhone model, used by GSAP
 *             to animate rotation when switching sizes.
 * - gsapType: DOM id applied to the View so GSAP can target it for slide
 *             transitions (e.g. "view1", "view2").
 * - controlRef: Ref to OrbitControls, used to read the current azimuthal
 *               angle and persist rotation state across size switches.
 * - setRotationState: Callback to store the current rotation angle.
 * - item:     The active phone model data (title, color array, texture image).
 * - size:     Current size selection ("small" | "large").
 */
type PhoneModelViewProps = {
  index: number
  groupRef: React.RefObject<THREE.Group>
  gsapType: string
  controlRef: React.RefObject<OrbitControlsType | null>
  setRotationState: React.Dispatch<React.SetStateAction<number>>
  item: {
    title: string
    color: string[]
    img: string
  }
  size: string
}

const PhoneModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  item,
  size,
}: PhoneModelViewProps) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? '-right-full' : ''}`}
    >

      {/* Base ambient light for the scene — ensures all surfaces have a minimum brightness */}
      <ambientLight intensity={0.9} />

      {/* Per-view perspective camera positioned 4 units along the z-axis */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* Per-view spotlights for direct illumination and shadows */}
      <Lights />

      {/* OrbitControls allows the user to rotate the model by dragging.
          Zoom and pan are disabled to keep focus on rotation only.
          onEnd saves the azimuthal angle so GSAP can restore it during size-switch animations. */}
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0, 0)}
        onEnd={() => controlRef.current && setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      <group
        ref={groupRef}
        name={`${index === 1 ? 'small' : 'large'}`}
        position={[0, 0, 0]}
      >
        <Suspense fallback={<Loader/>}>
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default PhoneModelView