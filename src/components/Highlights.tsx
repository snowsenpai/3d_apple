import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { rightImg, watchImg } from '../utils'
import VideoCarousel from './VideoCarousel'

const Highlights = () => {
  useGSAP(() => {
    gsap.to('#title', {
      opacity: 1,
      y: 0,
    })
    gsap.to('#link', {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.25,
    })
  }, [])

  return (
    <section id='highlights' className='w-screen h-full overflow-hidden common-padding bg-zinc'>
      <div className='screen-max-width'>
        <div className='w-full mb-12 md:flex items-end justify-between'>
          <h1 id='title' className='section-heading'>Get the highlights.</h1>

          <div className='flex flex-wrap items-end gap-5'>
            <p id='link' className='link'>
              Watch the film
              <img src={watchImg} alt="watch image" className='ml-2' />
            </p>
            <p id='link' className='link'>
              Watch the event
              <img src={rightImg} alt="right pointer" className='ml-2' />
            </p>
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  )
}

export default Highlights