import { makeAutoObservable } from 'mobx';
import { getCharacter } from '@services/api/characters.api.ts';

interface CharacterData {
  id: string;
  name: string;
  image: string;
  gender: string;
  species: string;
  status: string;
}

export class CharacterStore {
  character: CharacterData | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCharacterData({ id }: { id?: string }): Promise<void> {
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
