import pubsub from './pub-sub';
export const SOMETHING_CHANGED_TOPIC = 'something_changed';

export let currentNumber = 0;
export function incrementNumber() {
  currentNumber = randomNum(0, 3);
  pubsub.publish(SOMETHING_CHANGED_TOPIC, {
    somethingChanged: { id: `${currentNumber}` },
  });
  setTimeout(incrementNumber, 2000);
}

function randomNum(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
