import {
    Badge,
    Container,
    Heading,
    SkeletonText,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Switch,
    Tab,
    Tabs,
    TabList,
    TabPanel,
    TabPanels,
  } from "@chakra-ui/react";
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
  import { createFileRoute, useNavigate } from "@tanstack/react-router";
  import { useEffect } from "react";
  import { z } from "zod";
  
  import { type UserPublic, UsersService } from "../../client";
  import ActionsMenu from "../../components/Common/ActionsMenu";
  import Navbar from "../../components/Common/Navbar";
  import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx";
  
  // ✅ Ensure Type Exists
  type UserWithSubscription = UserPublic & {
    hasSubscription?: boolean;
    isTrial?: boolean;
    isDeactivated?: boolean;
  };
  
  // ✅ Subscription Schema
  const usersSearchSchema = z.object({
    page: z.number().catch(1),
  });
  
  // ✅ Ensure Route Export is Correct
  export const Route = createFileRoute("/_layout/subscriptions")({
    component: Subscriptions,
    validateSearch: (search) => usersSearchSchema.parse(search),
  });
  
  const PER_PAGE = 5;
  
  // ✅ API Call to Fetch Users
  function getUsersQueryOptions({ page }: { page: number }) {
    return {
      queryFn: async () =>
        UsersService.readUsers({
          skip: (page - 1) * PER_PAGE,
          limit: PER_PAGE,
        }) as Promise<{ data: UserWithSubscription[] }>,
      queryKey: ["users", { page }],
    };
  }
  
  // ✅ Subscription Table
  function SubscriptionTable() {
    const queryClient = useQueryClient();
    const currentUser = queryClient.getQueryData<UserWithSubscription>([
      "currentUser",
    ]);
    const { page } = Route.useSearch();
    const navigate = useNavigate({ from: Route.fullPath });
  
    const setPage = (page: number) =>
      navigate({
        search: (prev: Record<string, any>) => ({ ...prev, page }),
      });
  
    const { data: users, isPending } = useQuery({
      ...getUsersQueryOptions({ page }),
      placeholderData: (prevData) => prevData,
    });
  
    const hasNextPage = users?.data.length === PER_PAGE;
    const hasPreviousPage = page > 1;
  
    useEffect(() => {
      if (hasNextPage) {
        queryClient.prefetchQuery(getUsersQueryOptions({ page: page + 1 }));
      }
    }, [page, queryClient, hasNextPage]);
  
    // ✅ Fix: Ensure `useMutation` works correctly
    const mutation = useMutation({
      mutationFn: async ({
        userId,
        key,
        value,
      }: {
        userId: string;
        key: keyof UserWithSubscription;
        value: boolean;
      }) => {
        return UsersService.updateUserSubscription(userId, { [key]: value });
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
      },
      onError: (error) => {
        console.error("Subscription update failed:", error);
      },
    });
  
    const toggleSubscriptionState = (
      userId: string,
      key: keyof UserWithSubscription,
      value: boolean
    ) => {
      mutation.mutate({ userId, key, value });
    };
  
    return (
      <>
        <TableContainer>
          <Table size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th width="20%">Full Name</Th>
                <Th width="40%">Email</Th>
                <Th width="10%">Subscription</Th>
                <Th width="10%">Trial</Th>
                <Th width="10%">Deactivated</Th>
                <Th width="10%">Actions</Th>
              </Tr>
            </Thead>
            {isPending ? (
              <Tbody>
                <Tr>
                  {new Array(6).fill(null).map((_, index) => (
                    <Td key={index}>
                      <SkeletonText noOfLines={1} paddingBlock="16px" />
                    </Td>
                  ))}
                </Tr>
              </Tbody>
            ) : (
              <Tbody>
                {users?.data?.map((user) => (
                  <Tr key={user.id}>
                    <Td isTruncated maxWidth="150px">
                      {user.full_name || "N/A"}
                      {currentUser?.id === user.id && (
                        <Badge ml="1" colorScheme="teal">
                          You
                        </Badge>
                      )}
                    </Td>
                    <Td isTruncated maxWidth="200px">{user.email}</Td>
                    <Td>
                      <Switch
                        isChecked={!!user.hasSubscription}
                        onChange={() =>
                          toggleSubscriptionState(
                            user.id,
                            "hasSubscription",
                            !user.hasSubscription
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <Switch
                        isChecked={!!user.isTrial}
                        onChange={() =>
                          toggleSubscriptionState(user.id, "isTrial", !user.isTrial)
                        }
                      />
                    </Td>
                    <Td>
                      <Switch
                        isChecked={!!user.isDeactivated}
                        onChange={() =>
                          toggleSubscriptionState(
                            user.id,
                            "isDeactivated",
                            !user.isDeactivated
                          )
                        }
                      />
                    </Td>
                    <Td>
                      <ActionsMenu
                        type="User"
                        value={user}
                        disabled={currentUser?.id === user.id}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </TableContainer>
        <PaginationFooter
          onChangePage={setPage}
          page={page}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </>
    );
  }
  
  // ✅ Subscription Management Page
  function Subscriptions() {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          Subscription Management
        </Heading>
  
        <Navbar type={"Subscription"} addModalAs={null} />
  
        {/* ✅ Tabs for Different Product Memberships */}
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Proxy</Tab>
            <Tab>Scraping API</Tab>
            <Tab>Dataset</Tab>
          </TabList>
  
          <TabPanels>
            <TabPanel>
              <SubscriptionTable />
            </TabPanel>
            <TabPanel>
              <SubscriptionTable />
            </TabPanel>
            <TabPanel>
              <SubscriptionTable />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    );
  }
  
  export default Subscriptions;
  