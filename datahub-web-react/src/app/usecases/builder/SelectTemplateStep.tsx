import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { FormOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { UsecaseConfig, UsecaseBuilderState, StepProps } from './types';
import { UsecaseBuilderSteps } from './steps';
import useGetSourceLogoUrl from './useGetSourceLogoUrl';
import { CUSTOM } from './constants';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { UsecaseCard } from './UsecaseCard';

const Container = styled.div`
    max-height: 82vh;
    display: flex;
    flex-direction: column;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
    overflow: hidden;
`;

const CancelButton = styled(Button)`
    max-width: 120px;
`;

const SearchBarContainer = styled.div`
    display: flex;
    justify-content: end;
    width: auto;
    padding-right: 12px;
`;

const StyledSearchBar = styled(Input)`
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 0px 30px 0px rgb(239 239 239);
    border: 1px solid #e0e0e0;
    margin: 0 0 15px 0px;
    max-width: 300px;
    font-size: 16px;
`;

const StyledSearchOutlined = styled(SearchOutlined)`
    color: #a9adbd;
`;

const PlatformListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 31%), 1fr));
    gap: 10px;
    height: 100%;
    overflow-y: auto;
    padding-right: 12px;
`;

interface UsecaseTemplateOptionsProps {
    usecaseTemplate: UsecaseConfig;
    onClick: () => void;
}

function SourceOption({ usecaseTemplate, onClick }: UsecaseTemplateOptionsProps) {
    const { name, displayName, description, owner } = usecaseTemplate;

    const logoUrl = useGetSourceLogoUrl(name);
    let logoComponent;
    if (name === CUSTOM) {
        logoComponent = <FormOutlined style={{ color: ANTD_GRAY[8], fontSize: 28 }} />;
    }

    return (
        <UsecaseCard
            onClick={onClick}
            name={displayName}
            description={description}
            owner={owner}
        />
    );
}

/**
 * Component responsible for selecting the mechanism for constructing a new Ingestion Source
 */
export const SelectTemplateStep = ({ state, updateState, goTo, cancel, usecaseTemplates }: StepProps) => {
    const [searchFilter, setSearchFilter] = useState('');

    const onSelectTemplate = (type: string) => {
        const newState: UsecaseBuilderState = {
            ...state,
            config: undefined,
            type,
        };
        updateState(newState);
        goTo(UsecaseBuilderSteps.DEFINE_USE_CASE);
    };

    const filteredSources = usecaseTemplates.filter(
        (source) =>
            source.displayName.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()) ||
            source.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase()),
    );

    filteredSources.sort((a, b) => {
        if (a.name === 'custom') {
            return 1;
        }

        if (b.name === 'custom') {
            return -1;
        }

        return a.displayName.localeCompare(b.displayName);
    });

    return (
        <Container>
            <Section>
                <SearchBarContainer>
                    <StyledSearchBar
                        placeholder="Search data sources..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        allowClear
                        prefix={<StyledSearchOutlined />}
                    />
                </SearchBarContainer>
                <PlatformListContainer data-testid="data-source-options">
                    {filteredSources.map((usecaseTemplate) => (
                        <SourceOption key={usecaseTemplate.urn} usecaseTemplate={usecaseTemplate} onClick={() => onSelectTemplate(usecaseTemplate.name)} />
                    ))}
                </PlatformListContainer>
            </Section>
            <CancelButton onClick={cancel}>Cancel</CancelButton>
        </Container>
    );
};
