import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { SyntheticEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { highlightsSlides } from '../constants'
import { pauseImg, playImg, replayImg } from '../utils'

import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const VideoCarousel = () => {
  // Refs for accessing video elements and progress indicator spans
  const videoRef = useRef<(HTMLVideoElement | null)[]>([])
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([])  // Progress bar fill for each video
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([])   // Progress bar container for each video

  // Video playback state management
  const [video, setVideo] = useState({
    isEnd: false,        // Whether current video has ended
    startPlay: false,    // Whether playback has been initiated (after scroll trigger)
    videoId: 0,          // Index of currently active video
    isLastVideo: false,  // Whether we're on the final video in the carousel
    isPlaying: false,    // Whether video is currently playing
  })

  const {
    isEnd,
    startPlay,
    videoId,
    isLastVideo,
    isPlaying,
  } = video

  // Track which videos have loaded their metadata (for play readiness check)
  const [loadedData, setLoadedData] = useState<SyntheticEvent<HTMLVideoElement>[]>([])

  // GSAP scroll-triggered animation: auto-play video when it scrolls into view
  useGSAP(() => {
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    })
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none'  // restart animation on enter, do nothing on leave/re-enter
      },
      onComplete: () => {
        // Once scroll animation completes, begin video playback
        setVideo((prevVideo) => ({
          ...prevVideo,
          startPlay: true,
          isPlaying: true,
        }))
      }
    })
  }, [isEnd, videoId])

  // Control video play/pause based on state changes
  // Only acts once all videos have loaded their metadata (loadedData.length > 3)
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause()
      } else {
        // Only play if startPlay has been triggered (by scroll animation)
        startPlay && videoRef.current[videoId]?.play()
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData])

  // Called when video metadata loads - tracks load progress to ensure videos are ready before playing
  const handleLoadedMetadata = (
    event: SyntheticEvent<HTMLVideoElement>,
    _index: number
  ) => setLoadedData((prevLoaded) => [...prevLoaded, event])

  // Animate the progress indicator bar as the video plays
  //   - Tracking video currentTime vs duration
  //   - Updating progress bar width based on playback progress
  //   - Handling video completion to trigger next video
  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current

    if (span[videoId]) {
      // Animation for progress bar - currently empty, needs implementation
      let videoAnimation = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(videoAnimation.progress() * 100)

          if (progress !== currentProgress) {
            currentProgress = progress

            // set the width of the progress bar
            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? '10vw' // mobile
                  : window.innerWidth < 1200
                    ? '10vw' // tablet
                    : '4vw', // laptop
            });

            // set the background color of the progress bar
            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });
            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        }
      })


      if (videoId === 0) {
        videoAnimation.restart();
      }

      // update the progress bar
      const animationUpdate = () => {
        const video = videoRef.current[videoId];
        if (!video) return;  // Guard against null video element

        videoAnimation.progress(
          video.currentTime / highlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        // ticker to update the progress bar
        gsap.ticker.add(animationUpdate);
      } else {
        // remove the ticker when the video is paused (progress bar is stopped)
        gsap.ticker.remove(animationUpdate);
      }

      // Cleanup: remove ticker when effect re-runs or component unmounts
      return () => {
        gsap.ticker.remove(animationUpdate);
      }
    }
  }, [videoId, startPlay]) // adding isPlaying to the dependencies array causes the span to animate completely when pause is clicked and resets to currentProgress when play is clicked

  type TVideoProcess = 'video-end' | 'video-last' | 'video-reset' | 'play' | 'pause';

  /**
   * Handles video carousel state transitions based on user actions or video events.
   * @param processType - The type of process/action to handle
   * @param index - Optional video index (used with 'video-end' to specify next video)
   */
  const handleProcess = (processType: TVideoProcess, index?: number) => {
    switch (processType) {
      case 'video-end':
        // Current video finished - advance to next video (index + 1, or use provided index)
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: (index !== undefined ? index : prevVideo.videoId) + 1
        }))
        break;

      case 'video-last':
        // Mark that we've reached the final video in the carousel
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }))
        break;

      case 'video-reset':
        // Reset carousel to beginning (replay functionality)
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }))
        break;

      case 'play':
        // Resume video playback
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: true,
        }))
        break;

      case 'pause':
        // Pause video playback
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: false,
        }))
        break;

      default:
        return video
    }
  }

  return (
    <>
      {/* Video slides container - horizontally scrollable carousel */}
      <div className='flex items-center'>
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div className='w-full h-full flex-ce rounded-3xl overflow-hidden bg-black'>
                <video
                  id='video'
                  playsInline={true}
                  preload='auto'
                  muted
                  className={`${list.id === 2 && 'translate-x-44'}
                    pointer-events-none
                  }`}
                  ref={(element) => { videoRef.current[i] = element }}
                  onEnded={() =>
                    // If not the last video, advance to next; otherwise mark as last
                    i !== highlightsSlides.length - 1
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() => {
                    // Sync state when video starts playing (e.g., from autoplay)
                    setVideo((prevVideo) => ({
                      ...prevVideo, isPlaying: true
                    }))
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetadata(e, i)}
                >
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>

              {/* Text overlay for each video slide */}
              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text, i) => (
                  <p key={`${text}-${i}`} className='md:text-2xl text-xl font-medium>'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video controls: progress indicators + play/pause/replay button */}
      <div className='relative flex-center mt-10'>
        {/* Progress indicator dots - one per video */}
        <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
          {videoRef.current.map((_, i) => (
            <span
              className='mx-2 w-2 h-2 bg-gray-200 rounded-full relative cursor-pointer'
              key={i}
              ref={(element) => { videoDivRef.current[i] = element }}
            >
              {/* Inner span animates width to show video progress */}
              <span className='absolute h-full w-full rounded-full' ref={(element) => { videoSpanRef.current[i] = element }} />
            </span>
          ))}
        </div>

        {/* Play/Pause/Replay control button */}
        <button className='control-btn cursor-pointer'>
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')   // Replay from beginning
                : !isPlaying
                  ? () => handleProcess('play')        // Resume playback
                  : () => handleProcess('pause')       // Pause playback
            }
          />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel