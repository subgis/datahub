import { USECASE } from '../conf/usecase/usecase';
import { SNOWFLAKE } from '../conf/snowflake/snowflake';
import { BIGQUERY } from '../conf/bigquery/bigquery';
import { REDSHIFT } from '../conf/redshift/redshift';
import { LOOKER } from '../conf/looker/looker';
import { TABLEAU } from '../conf/tableau/tableau';
import { KAFKA } from '../conf/kafka/kafka';
import {
    INCLUDE_LINEAGE,
    TABLE_PROFILING_ENABLED,
    STATEFUL_INGESTION_ENABLED,
    INCLUDE_TABLES,
    INCLUDE_VIEWS,
    DATABASE_ALLOW,
    DATABASE_DENY,
    TABLE_LINEAGE_MODE,
    INGEST_TAGS,
    INGEST_OWNER,
    EXTRACT_USAGE_HISTORY,
    EXTRACT_OWNERS,
    SKIP_PERSONAL_FOLDERS,
    RecipeField,
    START_TIME,
    INCLUDE_TABLE_LINEAGE,
    TABLE_DENY,
    VIEW_DENY,
    VIEW_ALLOW,
    TABLE_ALLOW,
    SCHEMA_DENY,
    SCHEMA_ALLOW,
    COLUMN_PROFILING_ENABLED,
} from './common';
import {
    USECASE_SUMMARY,
    USECASE_DESCRIPTION,
    USECASE_DOMAIN,
    USECASE_OWNER,
    USECASE_TAGS,
} from './usecase';
import { PRESTO, PRESTO_HOST_PORT, PRESTO_DATABASE, PRESTO_USERNAME, PRESTO_PASSWORD } from './presto';
import { AZURE, BIGQUERY_BETA, CSV, DBT_CLOUD, MYSQL, OKTA, POWER_BI, SAC, UNITY_CATALOG, VERTICA } from '../constants';


export enum RecipeSections {
    Connection = 0,
    Filter = 1,
    Advanced = 2,
}

interface RecipeFields {
    [key: string]: {
        fields: RecipeField[];
        filterFields: RecipeField[];
        advancedFields: RecipeField[];
        connectionSectionTooltip?: string;
        filterSectionTooltip?: string;
        advancedSectionTooltip?: string;
        defaultOpenSections?: RecipeSections[];
    };
}

export const RECIPE_FIELDS: RecipeFields = {
    //define the fields for the use case form
    [USECASE]: {
        fields: [USECASE_SUMMARY, USECASE_TAGS, USECASE_DOMAIN, USECASE_DESCRIPTION, USECASE_OWNER],
        advancedFields: [
            INCLUDE_TABLES,
            INCLUDE_VIEWS,
            INCLUDE_LINEAGE,
            TABLE_PROFILING_ENABLED,
            COLUMN_PROFILING_ENABLED,
            STATEFUL_INGESTION_ENABLED,
        ],
        filterFields: [
            DATABASE_ALLOW,
            DATABASE_DENY,
            SCHEMA_ALLOW,
            SCHEMA_DENY,
            TABLE_ALLOW,
            TABLE_DENY,
            VIEW_ALLOW,
            VIEW_DENY,
        ],
        filterSectionTooltip: 'Include or exclude specific Databases, Schemas, Tables and Views from ingestion.',
    }
};

export const CONNECTORS_WITH_FORM = new Set(Object.keys(RECIPE_FIELDS));

export const CONNECTORS_WITH_TEST_CONNECTION = new Set([
    SNOWFLAKE,
    LOOKER,
    BIGQUERY_BETA,
    BIGQUERY,
    UNITY_CATALOG,
    SAC,
]);
