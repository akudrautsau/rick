import { CharactersStore } from '@store/characters/characters.store.ts';
import { createContext, useContext } from 'react';
import { CharacterStore } from '@store/character/character.store.ts';

const store = {
  charactersStore: new CharactersStore(),
  characterStore: new CharacterStore(),
};

const StoreContext = createContext(store);
export default function useStoreContext() {
  return useContext(StoreContext);
}
