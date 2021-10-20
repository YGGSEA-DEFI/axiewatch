import { Text, GridItem, SkeletonText, SimpleGrid, Tooltip } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useCallback, useMemo } from 'react';

import { formatter } from '../../../../../services/formatter';
import { scholarSelector } from '../../../../../recoil/scholars';
import { priceAtom } from '../../../../../recoil/price';

interface ScholarFieldSlpDayProps {
  address: string;
  isLoading: boolean;
}

const TooltipScholarSLP = ({ address }: { address: string }): JSX.Element => {
  const price = useRecoilValue(priceAtom);
  const scholar = useRecoilValue(scholarSelector(address));

  return (
    <SimpleGrid>
      <Text>
        {scholar.slpDay} SLP / day ({formatter(scholar.slpDay * price.values.slp, price.locale)})
      </Text>

      <Text>
        {scholar.slpDay * 7} SLP / week ({formatter(scholar.slpDay * price.values.slp * 7, price.locale)})
      </Text>

      <Text>
        {scholar.slpDay * 30} SLP / month ({formatter(scholar.slpDay * price.values.slp * 30, price.locale)})
      </Text>

      <Text fontSize="smaller" opacity={0.8} mt={2}>
        Note: Approximated with the SLP/day
      </Text>
    </SimpleGrid>
  );
};

export const ScholarFieldSlpDay = ({ address, isLoading }: ScholarFieldSlpDayProps): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));
  const price = useRecoilValue(priceAtom);

  const slpDayText = useMemo(
    () => formatter(scholar.slpDay * price.values.slp, price.locale),
    [price.locale, price.values.slp, scholar.slpDay]
  );

  const getSlpDayColor = useCallback(() => {
    if (scholar.slpDay >= 120) return 'green.200';
    if (scholar.slpDay >= 90 && scholar.slpDay < 120) return 'red.200';
    if (scholar.slpDay < 90) return 'red.300';
    return 'white';
  }, [scholar.slpDay]);

  return (
    <GridItem colSpan={4}>
      <SkeletonText isLoaded={!isLoading} noOfLines={2}>
        <Tooltip label={<TooltipScholarSLP address={scholar.address} />} isDisabled={isLoading}>
          <div>
            <Text color={getSlpDayColor as any} fontWeight="bold">
              {scholar.slpDay} / day
            </Text>

            <Text opacity={0.8} fontSize="sm">
              (≈{slpDayText})
            </Text>
          </div>
        </Tooltip>
      </SkeletonText>
    </GridItem>
  );
};