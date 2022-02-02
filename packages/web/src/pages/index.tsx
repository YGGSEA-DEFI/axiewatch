import {
  Box,
  Flex,
  Text,
  HStack,
  Stack,
  Button,
  Image,
  Divider,
  useBreakpointValue,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';

import { OverviewGrid } from '../components/OverviewGrid';
import { PreferencesButton } from '@src/components/Header/PreferencesButton';
import { scholarsMap } from '@src/recoil/scholars';
import { useBatchScholar } from '@src/services/hooks/useBatchScholar';
import { RequestStatusFloatingButton } from '@src/components/RequestStatusFloatingButton';
import { SignInForm } from '@src/components/SignInForm';
import { useAuth } from '@src/services/hooks/useAuth';
import { CloudSyncGroupButton } from '@src/components/CloudSyncGroupButton';
import { NewScholarButton } from '@src/components/Header/NewScholarButton';
import { NotablePerformersTable } from '@src/components/NotablePerformersTable';

function DashboardPage() {
  const scholars = useRecoilValue(scholarsMap);
  const addresses = useMemo(() => scholars.map(scholar => scholar.address), [scholars]);
  const { session } = useAuth();

  const { isError, isLoading, isRefetching, isFetching, refetch, data } = useBatchScholar({ addresses });
  const erroredScholars = useMemo(
    () => (!isLoading ? data.filter(scholar => scholar.errored || scholar.pvpErrored) : []),
    [data, isLoading]
  );

  const dividerOrientation: 'horizontal' | 'vertical' = useBreakpointValue(
    {
      base: 'horizontal',
      lg: 'vertical',
    },
    'base'
  );

  useEffect(() => {
    if (addresses.length) {
      document.getElementById('mainLayout').style.overflow = 'initial';
    } else {
      document.getElementById('mainLayout').style.overflow = 'hidden';
    }
  }, [addresses]);

  return (
    <Box>
      <PreferencesButton
        display="flex"
        position="fixed"
        top={24}
        right={2}
        variant="solid"
        colorScheme="purple"
        borderRadius="50% 50% 4px 50%"
        zIndex={5}
      />

      {!scholars.length && (
        <Box position="absolute" zIndex={200} w="100%" h="100%" top={0} left={0} backdropFilter="blur(15px)">
          <Box justify="center" display="flex" align="center" w="full" h="full">
            <HStack
              justify="center"
              align="center"
              spacing={{ base: 0, lg: 10 }}
              px={{ base: 1, lg: 0 }}
              flexDir={{ base: 'column', lg: 'row' }}
            >
              <Stack textAlign="center" spacing={3} mt={{ base: 5, lg: 0 }}>
                <Text fontSize="30px" fontWeight="bold">
                  Welcome 👋
                </Text>

                <Text maxW="500px">
                  Looks like you don&apos;t have any added scholar. Head over to{' '}
                  <b>
                    <Link href="/scholars">Scholars</Link>
                  </b>{' '}
                  to add your first or login to sync your existent account.
                </Text>

                <Box>
                  <NewScholarButton />
                </Box>
              </Stack>

              <Divider
                orientation={dividerOrientation}
                h={{ base: '10px', lg: '250px' }}
                w={{ base: '250px', lg: '10px' }}
              />

              <Box w="100%" maxW={{ base: '300px', lg: '350px' }} py={{ base: 5, lg: 0 }}>
                {session ? <CloudSyncGroupButton /> : <SignInForm />}
              </Box>
            </HStack>
          </Box>
        </Box>
      )}

      {!isError && (
        <>
          <OverviewGrid />
          <Box mt={6}>
            <NotablePerformersTable />
          </Box>
        </>
      )}

      {isError && (
        <Flex align="center" direction="column" w="100%" px={{ base: 1, lg: 0 }} mt={24}>
          <Image src="/images/axies/dead.png" alt="Dead Axie" opacity={0.9} height={{ base: '64px', lg: '128px' }} />

          <Stack align="center" spacing={0} mt={5}>
            <Text fontWeight="bold" fontSize="lg" textAlign="center">
              Something went wrong
            </Text>
            <Text fontSize="sm" variant="faded" textAlign="center">
              The API requests failed
            </Text>
          </Stack>

          <Stack align="center" spacing={0} mt={10}>
            <Button onClick={refetch}>Retry</Button>
          </Stack>
        </Flex>
      )}

      <RequestStatusFloatingButton
        errored={erroredScholars}
        isLoading={isLoading}
        isFetching={isRefetching || isFetching}
        refetch={refetch}
      />
    </Box>
  );
}

export default dynamic(() => Promise.resolve(DashboardPage), { ssr: false });

// <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} gap={8} pb={5}>
//   <GridItem colSpan={1}>
//     <SummaryCards />
//   </GridItem>

// {
/* <GridItem colSpan={1}>
            <Stack h="100%">
              <HStack>
                <Text fontWeight="bold" fontSize="lg">
                  Earnings Forecast
                </Text>

                <Tooltip label="How much should be your total accumulated value assuming your scholars daily average is constant and you make no claims.">
                  <Box>
                    <AiOutlineInfoCircle />
                  </Box>
                </Tooltip>
              </HStack>

              <Card p={5} h="100%">
                <EarningsForecastChart />
              </Card>
            </Stack>
          </GridItem> */
// }

//   <GridItem colSpan={{ base: 1, lg: 2 }}>
//     <NotablePerformersTable />
//   </GridItem>

//   <GridItem colSpan={{ base: 1, lg: 2 }}>
//     <Card p={5}>
//       <Text fontWeight="bold" fontSize="lg">
//         Daily SLP
//       </Text>

//       <DailySlpChart />
//     </Card>
//   </GridItem>
// </Grid>
