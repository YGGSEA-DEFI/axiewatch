import { Tooltip, Link, Tag, Text, Stack, Image, Box, SkeletonCircle, HStack, Icon } from '@chakra-ui/react';
import { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { useMemo } from 'react';

import { axieInfinityGraphQl } from '@src/services/api';
import { Axie } from '@src/recoil/scholars';
import {
  AquaticIcon,
  BeastIcon,
  BirdIcon,
  BugIcon,
  DawnIcon,
  DuskIcon,
  MechIcon,
  PlantIcon,
  ReptileIcon,
} from '../Icons/AxieIcons';

const query = gql`
  query GetAxieDetail($axieId: ID!) {
    axie(axieId: $axieId) {
      ...AxieDetail
    }
  }

  fragment AxieDetail on Axie {
    id
    image
    class
    chain
    name
    genes
    owner
    birthDate
    bodyShape
    class
    sireId
    sireClass
    matronId
    matronClass
    stage
    title
    breedCount
    level
    figure {
      atlas
      model
      image
    }
    parts {
      ...AxiePart
    }
    stats {
      ...AxieStats
    }
    auction {
      ...AxieAuction
    }
    ownerProfile {
      name
    }
    battleInfo {
      ...AxieBattleInfo
    }
    children {
      id
      name
      class
      image
      title
      stage
    }
  }

  fragment AxieBattleInfo on AxieBattleInfo {
    banned
    banUntil
    level
    __typename
  }

  fragment AxiePart on AxiePart {
    id
    name
    class
    type
    specialGenes
    stage
    abilities {
      ...AxieCardAbility
      __typename
    }
    __typename
  }

  fragment AxieCardAbility on AxieCardAbility {
    id
    name
    attack
    defense
    energy
    description
    backgroundUrl
    effectIconUrl
    __typename
  }

  fragment AxieStats on AxieStats {
    hp
    speed
    skill
    morale
    __typename
  }

  fragment AxieAuction on Auction {
    startingPrice
    endingPrice
    startingTimestamp
    endingTimestamp
    duration
    timeLeft
    currentPrice
    currentPriceUSD
    suggestedPrice
    seller
    listingIndex
    state
    __typename
  }
`;

interface GraphQLResponse {
  axie: Axie;
}

interface AxieCardProps {
  id: number;
}

const AxieCard = ({ id }: AxieCardProps): JSX.Element => {
  const imageUrl = `https://storage.googleapis.com/assets.axieinfinity.com/axies/${id}/axie/axie-full-transparent.png`;

  return (
    <Stack>
      <Image
        src={imageUrl}
        w="96px"
        h={{ lg: '72px' }}
        alt={`Axie ${id}`}
        fallback={
          <Box d="flex" alignItems="center" justifyContent="center" w="96px" h={{ lg: '72px' }}>
            <SkeletonCircle />
          </Box>
        }
        transition="all .2s ease-out"
        _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
      />

      <Text>Axie {id}</Text>
    </Stack>
  );
};

interface AxieTagProps {
  id: number;
}

export const AxieTag = ({ id }: AxieTagProps): JSX.Element => {
  const axieUrl = useMemo(() => `https://marketplace.axieinfinity.com/axie/${id}/?referrer=axie.watch`, [id]);

  const icons = {
    Beast: BeastIcon,
    Plant: PlantIcon,
    Bug: BugIcon,
    Mech: MechIcon,
    Dusk: DuskIcon,
    Aquatic: AquaticIcon,
    Bird: BirdIcon,
    Reptile: ReptileIcon,
    Dawn: DawnIcon,
  };

  const { data, isLoading } = useQuery(
    ['axie', id],
    async () => {
      const { axie } = await axieInfinityGraphQl.request<GraphQLResponse>(query, { axieId: id });
      return axie;
    },
    {
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  return (
    <Tooltip label={<AxieCard id={id} />} isDisabled={isLoading}>
      <Link href={axieUrl} target="_blank">
        <Tag>
          <Box>
            <HStack>
              {isLoading && <SkeletonCircle size="3" />}
              {data && <Icon as={icons[data?.class]} />}
              <Text>{id}</Text>
            </HStack>
          </Box>
        </Tag>
      </Link>
    </Tooltip>
  );
};