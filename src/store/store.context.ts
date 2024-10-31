import { CharactersStore } from '@store/characters/characters.store.ts';
import { createContext, useContext } from 'react';
import { CharacterStore } from '@store/character/character.store.ts';

const store = {
  charactersStore: new CharactersStore(),
  characterStore: new CharacterStore(),
};

Object.keys(store).map((key) => 'rootStore' in (store as any)[key] && ((store as any)[key].rootStore = store));

export const rootStore = store;
export type rootStore = typeof store;

const StoreContext = createContext(rootStore);
export default function useStoreContext() {
  return useContext(StoreContext);
}
