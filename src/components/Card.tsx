import { FC, MouseEvent } from 'react';
import { Grid, Image, Text } from '@mantine/core';

interface Character {
  id: string;
  name: string;
  image: string;
  gender: string;
  species: string;
  status: string;
}

interface CardProps {
  character: Character;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const Card: FC<CardProps> = ({ character, onClick }) => {
  const { name, id, image, gender, species, status } = character;

  return (
    <Grid.Col key={`${name}_${id}`} span={4} className='card' onClick={onClick}>
      <Image src={image} radius='md' h={200} w={200} />
      <div className='card-info'>
        <Text ta='left'>
          <b>Name</b>: {name}
        </Text>
        <Text ta='left'>
          <b>Gender</b>: {gender}
        </Text>
        <Text ta='left'>
          <b>Species</b>: {species}
        </Text>
        <Text ta='left'>
          <b>Status</b>: {status}
        </Text>
      </div>
    </Grid.Col>
  );
};
