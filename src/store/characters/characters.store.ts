import { makeAutoObservable, observable } from 'mobx';
import { getCharacters } from '@services/api/characters.api.ts';
import { CharacterData } from '@/types';

interface CharactersInfo {
  pages: number;
}

interface GetCharactersParams {
  page?: number;
  name?: string | null;
  status?: string | null;
}

export class CharactersStore {
  characters = observable.array<CharacterData>([]);
  charactersInfoPages = 1;
  currentPage = 0;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getCharactersData({ page = 1, name = '', status = '' }: GetCharactersParams = {}): Promise<void> {
    this.setLoading(true);
    try {
      const characters = await getCharacters({ page, name, status });
      this.setCharacters(characters.results);
      this.setCharactersInfo(characters.info);
      this.setCurrentPage(page);
    } catch (e) {
      console.error('Failed to fetch characters:', e);
      throw e;
    } finally {
      this.setLoading(false);
    }
  }

  setCharacters(newCharacters: CharacterData[]): void {
    this.characters.replace(newCharacters);
  }

  setCharactersInfo(info: CharactersInfo): void {
    this.charactersInfoPages = info.pages;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
