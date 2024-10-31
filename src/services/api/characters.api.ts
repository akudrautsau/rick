import http from '@services/axios';

const path = 'https://rickandmortyapi.com/api/character';

export async function getCharacters({ page = 1, name = '', status = '' }) {
  try {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (name) params.append('name', name);
    if (status) params.append('status', status);

    return await http.get(`${path}?${params.toString()}`);
  } catch (e) {
    console.error('Failed to fetch characters:', e);
    throw e;
  }
}

export async function getCharacter({ id }: { id?: string }) {
  try {
    return await http.get(`${path}/${id}`);
  } catch (e) {
    console.error('Failed to fetch characters:', e);
    throw e;
  }
}
