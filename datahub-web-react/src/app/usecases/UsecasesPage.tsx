import React, { useEffect } from 'react';
//import { HomePageHeader } from './HomePageHeader';
//import { HomePageBody } from './HomePageBody';
import analytics, { EventType } from '../analytics';
import { OnboardingTour } from '../onboarding/OnboardingTour';
import {
    GLOBAL_WELCOME_TO_DATAHUB_ID,
    HOME_PAGE_INGESTION_ID,
    HOME_PAGE_DOMAINS_ID,
    HOME_PAGE_MOST_POPULAR_ID,
    HOME_PAGE_PLATFORMS_ID,
    HOME_PAGE_SEARCH_BAR_ID,
} from '../onboarding/config/HomePageOnboardingConfig';
import { SearchResults } from './SearchResults';
import { SearchPage } from './SearchPage';
import styled from 'styled-components';
import { Tabs, Typography } from 'antd';
import { useAppConfig } from '../useAppConfig';
import { useUserContext } from '../context/useUserContext';
import { PlusOutlined } from '@ant-design/icons';
import { UsecaseBuilderModal } from './builder/UsecaseBuilderModal';
import { useListIngestionSourcesQuery } from '../../graphql/ingestion.generated';

const PageContainer = styled.div`
    padding-top: 20px;
`;

const PageHeaderContainer = styled.div`
    && {
        padding-left: 24px;
    }
`;

const PageTitle = styled(Typography.Title)`
    && {
        margin-bottom: 12px;
    }
`;

const StyledTabs = styled(Tabs)`
    &&& .ant-tabs-nav {
        margin-bottom: 0;
        padding-left: 28px;
    }
`;

const Tab = styled(Tabs.TabPane)`
    font-size: 14px;
    line-height: 22px;
`;

const ListContainer = styled.div``;

enum TabType {
    Overview = 'Overview',
    Settings = 'Settings',
    Create = 'New use case',
}

export enum IngestionSourceType {
    ALL,
    UI,
    CLI,
}

export const UsecasesPage = () => {

    /*    const { loading, error, data, client, refetch } = useListIngestionSourcesQuery({
           variables: {
               input: {
                   start,
                   count: pageSize,
                   query: query?.length ? query : undefined,
                   filters: filters.length ? filters : undefined,
                   sort,
               },
           },
           fetchPolicy: (query?.length || 0) > 0 ? 'no-cache' : 'cache-first',
       }); */

    const me = useUserContext();
    const { config, loaded } = useAppConfig();
    const isIngestionEnabled = config?.managedIngestionConfig.enabled;
    const showIngestionTab = isIngestionEnabled && me && me.platformPrivileges?.manageIngestion; //update for use case entiry
    const showSecretsTab = isIngestionEnabled && me && me.platformPrivileges?.manageSecrets; //update for use case entiry
    const [selectedTab, setSelectedTab] = React.useState<TabType>(TabType.Overview);
    const [isBuildingUsecase, setIsBuildingUsecase] = React.useState(false);
    const [focusSourceUrn, setFocusSourceUrn] = React.useState<undefined | string>(undefined);
    const [focusExecutionUrn, setFocusExecutionUrn] = React.useState<undefined | string>(undefined);
    const [lastRefresh, setLastRefresh] = React.useState(0);
    const [removedUrns, setRemovedUrns] = React.useState<string[]>([]);
    // const totalSources = data?.listIngestionSources?.total || 0;
    //const sources = data?.listIngestionSources?.ingestionSources || [];
    // const filteredSources = sources.filter((source) => !removedUrns.includes(source.urn)) as IngestionSource[];
    // const focusSource = (focusSourceUrn && filteredSources.find((source) => source.urn === focusSourceUrn)) || undefined;

    const removeExecutionsFromIngestionSource = (source) => {
        if (source) {
            return {
                name: source.name,
                type: source.type,
                schedule: source.schedule,
                config: source.config,
            };
        }
        return undefined;
    };

    // defaultTab might not be calculated correctly on mount, if `config` or `me` haven't been loaded yet
    useEffect(() => {
        if (loaded && me.loaded && !showIngestionTab && selectedTab === TabType.Overview) {
            setSelectedTab(TabType.Settings);
        }
    }, [loaded, me.loaded, showIngestionTab, selectedTab]);

    useEffect(() => {
        analytics.event({ type: EventType.UsecasePageViewEvent });
    }, []);


    const onClickTab = (newTab: string) => {
        if (newTab === TabType.Create) {
            // analytics.event({ type: EventType.UsecaseCreateEvent });
            setIsBuildingUsecase(true);
        } else {
            setSelectedTab(TabType[newTab]);
        }
    };

    const onSubmit = (/* recipeBuilderState: SourceBuilderState, resetState: () => void, shouldRun?: boolean */) => {
        console.log('create use case on submit executed');
  /*       createOrUpdateIngestionSource(
            {
                type: recipeBuilderState.type as string,
                name: recipeBuilderState.name as string,
                config: {
                    recipe: recipeBuilderState.config?.recipe as string,
                    version:
                        (recipeBuilderState.config?.version?.length &&
                            (recipeBuilderState.config?.version as string)) ||
                        undefined,
                    executorId:
                        (recipeBuilderState.config?.executorId?.length &&
                            (recipeBuilderState.config?.executorId as string)) ||
                        DEFAULT_EXECUTOR_ID,
                    debugMode: recipeBuilderState.config?.debugMode || false,
                    extraArgs: formatExtraArgs(recipeBuilderState.config?.extraArgs || []),
                },
                schedule: recipeBuilderState.schedule && {
                    interval: recipeBuilderState.schedule?.interval as string,
                    timezone: recipeBuilderState.schedule?.timezone as string,
                },
            },
            resetState,
            shouldRun,
        ); */
    };

    const onCancel = () => {
        setIsBuildingUsecase(false);
       // setIsViewingRecipe(false);
        setFocusSourceUrn(undefined);
    };



    return (
        <>
            {/*    <OnboardingTour
                stepIds={[
                    GLOBAL_WELCOME_TO_DATAHUB_ID,
                    HOME_PAGE_INGESTION_ID,
                    HOME_PAGE_DOMAINS_ID,
                    HOME_PAGE_PLATFORMS_ID,
                    HOME_PAGE_MOST_POPULAR_ID,
                    HOME_PAGE_SEARCH_BAR_ID,
                ]}
            /> */}
            {/* <HomePageHeader /> */}
            {/*  <HomePageBody /> */}
            <PageContainer>
                <PageHeaderContainer>
                    <PageTitle level={3}>Manage Use Cases</PageTitle>
                    <Typography.Paragraph type="secondary">
                        Configure and schedule syncs to import data from your data sources
                    </Typography.Paragraph>
                </PageHeaderContainer>
                <StyledTabs activeKey={selectedTab} size="large" onTabClick={(tab: string) => onClickTab(tab)}>
                    {showIngestionTab && <Tab key={TabType.Overview} tab={TabType.Overview} />}
                    {showSecretsTab && <Tab key={TabType.Settings} tab={TabType.Settings} />}
                    {<Tab key={TabType.Create} tab={<><PlusOutlined />{TabType.Create}</>} />}
                    <PlusOutlined />
                </StyledTabs>
                {selectedTab === TabType.Overview && <SearchPage />}
                {selectedTab === TabType.Settings && <ListContainer>Overview</ListContainer>}
                <UsecaseBuilderModal
                    // initialState={removeExecutionsFromIngestionSource(focusSource)} //check if needed later
                    open={isBuildingUsecase}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            </PageContainer >
        </>
    );
};
