import { signalingUrl } from '@/lib/webrtc/config';
import { useEffect, useState } from 'react';

export const useSignaling = () => {
  const [socket, setSocket] = useState<WebSocket>();
  const [message, setMessage] = useState<any>();

  useEffect(() => {
    const socket = new WebSocket(signalingUrl);
    setSocket(socket);

    const handleMessage = (event: MessageEvent) => {
      setMessage(event);
    };

    socket.onmessage = handleMessage;

    socket.onclose = () => {
      socket.removeEventListener('message', handleMessage);
    };

    return () => {
      //socket.close();
    };
  }, []);

  function send(message: any) {
    socket?.send(message);
  }

  return {
    send,
    message,
  };
};
