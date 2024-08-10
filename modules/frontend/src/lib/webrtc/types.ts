export enum MessageType {
  OFFER = 'offer',
  ANSWER = 'answer',
  ICE_CANDIDATE = 'ice_candidate',
}

export type SocketMessage = OfferMessage | AnswerMessage | IceMessage;

type OfferMessage = {
  type: MessageType.OFFER;
  payload: RTCSessionDescriptionInit;
};

type AnswerMessage = {
  type: MessageType.ANSWER;
  payload: RTCSessionDescriptionInit;
};

type IceMessage = {
  type: MessageType.ICE_CANDIDATE;
  payload: RTCIceCandidate;
};
