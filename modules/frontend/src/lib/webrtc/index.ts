import { constraint } from './config';

export async function getMedia(): Promise<MediaStream | void> {
  return navigator.mediaDevices
    .getUserMedia(constraint)
    .then((stream) => stream)
    .catch((error) => {
      console.log('Oops, something happened', error);
    });
}
