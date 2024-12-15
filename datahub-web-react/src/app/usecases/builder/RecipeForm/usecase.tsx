import { FieldType, RecipeField, setListValuesOnRecipe } from './common';

export const USECASE_SUMMARY: RecipeField = {
    name: 'summary',
    label: 'Use Case Summary',
    tooltip:
        'The Snowflake Account Identifier e.g. myorg-account123, account123-eu-central-1, account123.west-us-2.azure',
    type: FieldType.TEXT,
    fieldPath: 'source.config.account_id',
    placeholder: 'xyz123',
    rules: null,
    required: true,
};

const resourceIdAllowFieldPath = 'source.config.resource_id_pattern.allow';
export const USECASE_TAGS: RecipeField = {
    name: 'tags',
    label: 'Tags',
    tooltip: 'The name of the Snowflake Warehouse to extract metadata from.',
    type: FieldType.TAGS,
    fieldPath: 'source.config.warehouse.test',
    //placeholder: 'COMPUTE_WH',
    rules: null,
    required: true,
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, resourceIdAllowFieldPath),
};

export const USECASE_DOMAIN: RecipeField = {
    name: 'domain',
    label: 'Domain',
    tooltip: 'Snowflake username.',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'snowflake',
    rules: null,
    required: true,
};

export const USECASE_DESCRIPTION: RecipeField = {
    name: 'description',
    label: 'Description',
    tooltip: 'Snowflake password.',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    rules: null,
    required: true,
};

export const USECASE_OWNER: RecipeField = {
    name: 'owner',
    label: 'Use Case Owener',
    tooltip: 'The Role to use when extracting metadata from Snowflake.',
    type: FieldType.TEXT,
    fieldPath: 'source.config.role',
    placeholder: 'datahub_role',
    rules: null,
    required: true,
};
