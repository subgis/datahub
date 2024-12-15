import { SourceConfig } from '../types';

const placeholderRecipe = `\
source: 
    type: snowflake
    config:
        account_id: "example_id"
        warehouse: "example_warehouse"
        role: "datahub_role"
        include_table_lineage: true
        include_view_lineage: true
        profiling:
            enabled: true
        stateful_ingestion:
            enabled: true
`;

export const USECASE = 'usecase';

const usecaseConfig: SourceConfig = {
    type: USECASE,
    placeholderRecipe,
    displayName: 'Snowflake',
    docsUrl: 'https://datahubproject.io/docs/generated/ingestion/sources/snowflake/',
};

export default usecaseConfig;
