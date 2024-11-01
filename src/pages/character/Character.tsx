import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Image, Loader } from '@mantine/core';
import useStoreContext from '@store/store.context.ts';
import { observer } from 'mobx-react-lite';
import { CharacterData } from '@/types';

interface CharacterStore {
  character?: CharacterData | null;
  loading: boolean;
  getCharacterData: (params: { id?: string }) => void;
}

function Character() {
  const { id } = useParams<{ id: string }>();
  const { characterStore } = useStoreContext() as unknown as { characterStore: CharacterStore };

  useEffect(() => {
    if (!characterStore.character || characterStore.character.id !== id) {
      characterStore.getCharacterData({ id });
    }
  }, [id, characterStore]);

  if (characterStore.loading) {
    return <Loader />;
  }

  if (!characterStore.character) {
    return <div>Character not found.</div>;
  }

  return (
    <div className='character-details'>
      <Image src={characterStore.character.image} radius='lg' h={300} w={300} />
      <Text mt={16}>
        <b>Name:</b> {characterStore.character.name}
      </Text>
      <Text>
        <b>Gender:</b> {characterStore.character.gender}
      </Text>
      <Text>
        <b>Species:</b> {characterStore.character.species}
      </Text>
      <Text>
        <b>Status:</b> {characterStore.character.status}
      </Text>
    </div>
  );
}

export default observer(Character);
