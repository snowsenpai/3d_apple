import * as THREE from 'three'
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import Lights from './Lights'
import IPhone from './IPhone'
import { Suspense } from 'react'
import Loader from './Loader'

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

      <ambientLight intensity={0.9} />

      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      <Lights />

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