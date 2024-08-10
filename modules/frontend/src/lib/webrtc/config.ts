export const constraint = {
  video: true,
  audio: true,
};

export const signalingUrl = 'ws://localhost:8080/signal';

export const servers: RTCConfiguration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

