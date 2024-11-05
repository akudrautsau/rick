import { useEffect, useState, useCallback, ChangeEvent, SetStateAction, Dispatch } from 'react';
import { observer } from 'mobx-react-lite';
import useStoreContext from '@store/store.context.ts';
import { Grid, InputBase, Pagination, Select } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Card } from '@/components/Card.tsx';
import { useUpdateUrlParams } from '@hooks/useUpdateUrlParams.ts';
import './App.css';

function App() {
  const [valueName, setValueName] = useState<string | null>(null);
  const [valueStatus, setValueStatus] = useState<string | null>(null);
  const { charactersStore } = useStoreContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { updateURLParams } = useUpdateUrlParams();

  const handlePageChange = (page: number) => {
    if (page !== charactersStore.currentPage) {
      updateURLParams({ page, status: valueStatus, name: valueName });
    }
  };

  const debouncedGetCharactersData = useCallback(
    debounce((name: string | null, status: string | null) => {
      updateURLParams({ page: 1, name, status });
    }, 300),
    []
  );

  const handleInputChange =
    (setter: Dispatch<SetStateAction<string | null>>) => (event: ChangeEvent<HTMLInputElement> | string | null) => {
      const newValue = typeof event === 'string' || event == null ? event : event.currentTarget.value;
      setter(newValue);

      charactersStore.setCurrentPage(1);
    };

  useEffect(() => {
    debouncedGetCharactersData(valueName, valueStatus);
  }, [valueName, valueStatus, debouncedGetCharactersData]);

  const handleCharacterClick = (characterId: string) => {
    navigate(`/character/${characterId}`);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let page = parseInt(searchParams.get('page') as string) || 1;
    const status = searchParams.get('status') as string;
    const name = searchParams.get('name') as string;
    if (!charactersStore.charactersInfoPages || +page > charactersStore.charactersInfoPages) page = 1;

    setValueName(name);
    setValueStatus(status);

    if (searchParams.size)
      charactersStore.getCharactersData({
        page,
        name,
        status,
      });
  }, [location.search]);

  return (
    <>
      <h1>Characters</h1>
      <div className='filters'>
        <InputBase
          placeholder={'Enter name for filter by name'}
          onChange={handleInputChange(setValueName)}
          mt='md'
          w={600}
          defaultValue={valueName ?? ''}
        />
        <Select
          label='Select status for filter by status'
          placeholder='Select status'
          onChange={(value) => handleInputChange(setValueStatus)(value || null)}
          mt='md'
          w={600}
          value={valueStatus || null}
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
        total={charactersStore.charactersInfoPages || 1}
        value={charactersStore.currentPage}
        onChange={handlePageChange}
      />
    </>
  );
}

export default observer(App);
