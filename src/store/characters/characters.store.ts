import { makeAutoObservable, observable } from 'mobx';
import { getCharacters } from '@services/api/characters.api.ts';

interface CharacterData {
  id: string;
  name: string;
  image: string;
  gender: string;
  species: string;
  status: string;
}

interface CharactersInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

interface GetCharactersParams {
  page?: number;
  name?: string;
  status?: string;
}

export class CharactersStore {
  characters = observable.array<CharacterData>([]);
  chatactersInfo: CharactersInfo | null = null;
  currentPage = 1;
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

  setCharactersInfo(info: CharactersInfo | null): void {
    this.chatactersInfo = info;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
