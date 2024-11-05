import { makeAutoObservable } from 'mobx';
import { getCharacter } from '@services/api/characters.api.ts';
import { CharacterData } from '@/types';

export class CharacterStore {
  character: CharacterData | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCharacterData({ id }: { id?: number }): Promise<void> {
    this.setLoading(true);
    try {
      const character = await getCharacter({ id });
      this.setCharacter(character);
    } catch (e) {
      console.error('Failed to fetch character:', e);
      throw e;
    } finally {
      this.setLoading(false);
    }
  }

  setCharacter(newCharacter: CharacterData | null): void {
    this.character = newCharacter;
  }

  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
