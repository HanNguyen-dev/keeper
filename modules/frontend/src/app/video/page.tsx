'use client';
import { useRef } from 'react';
import style from './Video.module.css';
import { getMedia } from '@/lib/webrtc';
import { Button } from '@nextui-org/react';

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);

  function handleClick() {
    getMedia().then((stream) => {
      if (videoRef.current && 'srcObject' in videoRef.current) {
        // @ts-ignore
        videoRef.current.srcObject = stream;
      }
    });
  }

  function handleDisconnect() {
    videoRef.current && (videoRef.current.srcObject = null);
  }

  return (
    <div className={style.page}>
      <h1>Video</h1>
      <div className={style.body}>
        <video autoPlay ref={videoRef}></video>
        <Button onClick={handleClick}>Connect</Button>
        <Button onClick={handleDisconnect}>Disconnect</Button>
      </div>
    </div>
  );
}
