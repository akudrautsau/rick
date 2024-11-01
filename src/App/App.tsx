import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import useStoreContext from '@store/store.context.ts';
import { Grid, InputBase, Pagination, Select } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Card } from '@/components/Card.tsx';
import { useUpdateUrlParams } from '@hooks/useUpdateUrlParams.ts';
import { CharacterData } from '@/types';
import './App.css';

interface CharactersStore {
  characters: CharacterData[];
  loading: boolean;
  currentPage: number;
  charactersInfo?: {
    pages: number;
  };
  getCharactersData: (params: { page: number; name?: string; status?: string }) => void;
  setCurrentPage: (page: number) => void;
}

function App() {
  const [valueName, setValueName] = useState<string | null>(null);
  const [valueStatus, setValueStatus] = useState<string | null>(null);
  const { charactersStore } = useStoreContext() as { charactersStore: CharactersStore };
  const navigate = useNavigate();
  const location = useLocation();

  const { updateURLParams } = useUpdateUrlParams({ valueName, valueStatus });

  const handlePageChange = (page: number) => {
    if (page !== charactersStore.currentPage) {
      updateURLParams({ page, status: valueStatus, name: valueName });
    }
  };

  const debouncedGetCharactersData = useCallback(
    debounce((name: string | null, status: string | null) => {
      updateURLParams({ page: 1, name, status });
    }, 300),
    [charactersStore]
  );

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string | null>>, paramName: 'name' | 'status') =>
    (event: ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof event === 'string' ? event : event.currentTarget.value;
      setter(newValue);

      charactersStore.setCurrentPage(1);

      debouncedGetCharactersData(
        paramName === 'name' ? newValue : valueName,
        paramName === 'status' ? newValue : valueStatus
      );
    };

  const handleCharacterClick = (characterId: string) => {
    navigate(`/character/${characterId}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let page = parseInt(searchParams.get('page') as string) || 1;
    const status = searchParams.get('status') as string;
    const name = searchParams.get('name') as string;
    if (!charactersStore.charactersInfo?.pages || +page > charactersStore.charactersInfo?.pages) page = 1;

    setValueName(name);
    setValueStatus(status);

    updateURLParams({ page, status, name });
  }, [location.search]);

  return (
    <>
      <h1>Characters</h1>
      <div className='filters'>
        <InputBase
          placeholder={'Enter name for filter by name'}
          onChange={handleInputChange(setValueName, 'name')}
          mt='md'
          w={600}
          defaultValue={valueName ?? ''}
        />
        <Select
          label='Select status for filter by status'
          placeholder='Select status'
          onChange={(value) => handleInputChange(setValueStatus, 'status')(value || '')}
          mt='md'
          w={600}
          value={valueStatus ?? ''}
          data={[
            { value: 'alive', label: 'Alive' },
            { value: 'dead', label: 'Dead' },
            { value: 'unknown', label: 'Unknown' },
          ]}
          allowDeselect
        />
      </div>
      <div className='cards'>
        <Grid>
          {charactersStore.characters.length > 0 && (
            <>
              {charactersStore.characters.map((character) => (
                <Card
                  key={`${character.name}_${character.id}`}
                  character={character}
                  onClick={() => handleCharacterClick(character.id)}
                />
              ))}
            </>
          )}
        </Grid>
      </div>
      <Pagination
        className={'paginator'}
        total={charactersStore.charactersInfo?.pages || 1}
        value={charactersStore.currentPage}
        onChange={handlePageChange}
      />
    </>
  );
}

export default observer(App);
