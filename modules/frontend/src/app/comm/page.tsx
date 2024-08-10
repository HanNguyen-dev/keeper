'use client';
import { useState } from 'react';
import style from './Comm.module.css';
import { getMedia } from '@/lib/webrtc';
import { useSignaling } from './useSignaling';
import { Button } from '@nextui-org/react';
import { WebRTCConnection } from '@/lib/webrtc/config';

export default function Comm() {
  const [connection, setConnection] = useState<WebRTCConnection>();
  const { message } = useSignaling();

  console.log(message);

  function start() {
    const webConnection = new WebRTCConnection();
    setConnection(webConnection);
  }

  return (
    <div className={style.page}>
      <h1>Connecting</h1>
      <div className={style.body}>
        <button onClick={getMedia}>Get media</button>
        <Button onClick={start}>Start</Button>
        {connection && (
          <Button onClick={() => connection.createCall()}>Call</Button>
        )}
      </div>
    </div>
  );
}
