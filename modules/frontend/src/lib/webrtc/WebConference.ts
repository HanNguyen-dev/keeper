import { constraint, servers, signalingUrl } from './config';
import { MessageType, SocketMessage } from './types';

// eslint-disable-next-line no-unused-vars
type HandleRTCSession = (desc: RTCSessionDescriptionInit) => void;

export class WebConference {
  connecting = false;
  peerConnection: RTCPeerConnection;
  offerCandidates: RTCIceCandidate[] = [];
  signalingSocket: WebSocket;
  localStream?: MediaStream;
  remoteStream: MediaStream;

  handleCall: HandleRTCSession;

  constructor(handleCall: HandleRTCSession) {
    this.handleCall = handleCall;
    this.peerConnection = new RTCPeerConnection(servers);
    this.signalingSocket = new WebSocket(signalingUrl);
    this.remoteStream = new MediaStream();

    this.handleMessage = this.handleMessage.bind(this);
    this.signalingSocket.onmessage = this.handleMessage;
  }

  initCall(): void {
    // setup WebRTC
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream.addTrack(track);
      });
    };

    navigator.mediaDevices
      .getUserMedia(constraint)
      .then((stream) => {
        this.localStream = stream;

        this.localStream.getTracks().forEach((track) => {
          if (this.localStream) {
            this.peerConnection.addTrack(track, this.localStream);
          }
        });
        this.createOffer();
      })
      .catch((error) => {
        console.log('error getting media', error);
      });
  }

  private async createOffer(): Promise<void> {
    this.connecting = true;
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const message: SocketMessage = {
          type: MessageType.ICE_CANDIDATE,
          payload: event.candidate,
        };
        this.signalingSocket.send(JSON.stringify(message));
      }
    };

    const offerDescription = await this.peerConnection?.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription); // generate IceCandidates

    const message: SocketMessage = {
      type: MessageType.OFFER,
      payload: offerDescription,
    };
    this.signalingSocket.send(JSON.stringify(message));
  }

  async answer(offer: RTCSessionDescriptionInit): Promise<void> {
    this.connecting = true;
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    const message: SocketMessage = {
      type: MessageType.ANSWER,
      payload: answer,
    };
    this.signalingSocket.send(JSON.stringify(message));

    if (this.offerCandidates.length) {
      this.offerCandidates.forEach((candidate) => {
        this.peerConnection.addIceCandidate(candidate);
      });
      this.offerCandidates = [];
    }
  }

  close(): void {
    this.signalingSocket.removeEventListener('message', this.handleMessage);
    this.signalingSocket.close();
  }

  /**** Beginning message handlers for signaling socket ****/
  private handleMessage(event: MessageEvent): void {
    const message: SocketMessage = JSON.parse(event.data);

    switch (message.type) {
      case MessageType.OFFER:
        this.handleCall(message.payload);
        break;
      case MessageType.ANSWER:
        this.handleAnswer(message.payload);
        break;
      case MessageType.ICE_CANDIDATE:
        this.handleIceCandidate(message.payload);
        break;
      default:
        console.count(`Do something: ${event.data}`);
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    const remoteDesc = new RTCSessionDescription(answer);
    await this.peerConnection.setRemoteDescription(remoteDesc);
  }

  async handleIceCandidate(candidate: RTCIceCandidate) {
    try {
      if (this.connecting) {
        this.peerConnection.addIceCandidate(candidate);
      } else {
        this.offerCandidates = [...this.offerCandidates, candidate];
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**** Ending message handlers for signaling socket ****/
}
