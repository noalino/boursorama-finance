import { USER_AGENTS } from './constants';

export const randomUserAgent = () => randomChoice(USER_AGENTS);

export function randomChoice(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}
