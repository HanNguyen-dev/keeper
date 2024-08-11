'use client';
import { useRef, useState } from 'react';
import style from './Comm.module.css';
import { Button } from '@nextui-org/react';
import { WebConference } from '@/lib/webrtc/WebConference';

export default function Comm() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [connection, setConnection] = useState<WebConference>();
  const [offer, setOffer] = useState<RTCSessionDescriptionInit>();

  function start() {
    const handleCall = (offer: RTCSessionDescriptionInit) => {
      setOffer(offer);
    };
    const webConnection = new WebConference(handleCall);
    setConnection(webConnection);
  }

  function answer() {
    offer && connection?.answer(offer);
  }

  function setLocalVideo() {
    if (localVideoRef.current && 'srcObject' in localVideoRef.current) {
      // @ts-ignore
      localVideoRef.current.srcObject = connection?.localStream;
    }
  }

  function setRemoteVideo() {
    if (remoteVideoRef.current && 'srcObject' in remoteVideoRef.current)
      // @ts-ignore
      remoteVideoRef.current.srcObject = connection?.remoteStream;
  }

  return (
    <div className={style.page}>
      <h1>Connecting</h1>
      <div className={style.body}>
        {!connection ? (
          <Button onClick={start}>Start</Button>
        ) : (
          <>
            <Button onClick={() => connection.initCall()}>Call</Button>
            <Button onClick={setLocalVideo}>Local video</Button>
            <Button onClick={setRemoteVideo}>Remote video</Button>
          </>
        )}
        {offer && <Button onClick={answer}>Answer</Button>}
        <div className={style.videoGrid}>
          <video autoPlay ref={localVideoRef}></video>
          <video autoPlay ref={remoteVideoRef}></video>
        </div>
      </div>
    </div>
  );
}
