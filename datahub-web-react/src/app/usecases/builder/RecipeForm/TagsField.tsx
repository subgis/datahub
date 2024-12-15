import React from 'react';
import { Checkbox, DatePicker, Form, Input, Select, Tooltip, Tag } from 'antd';
import styled from 'styled-components/macro';
import Button from 'antd/lib/button';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { RecipeField, FieldType } from './common';
import { EntityType, SubResourceType } from '../../../../types.generated';
import SecretField, { StyledFormItem } from './SecretField/SecretField';
import DictField, { Label, StyledQuestion, ListWrapper, ErrorWrapper } from './DictField';
import { ANTD_GRAY } from '../../../entity/shared/constants';
import { useGetRootGlossaryTermsQuery, useGetRootGlossaryNodesQuery } from '../../../../graphql/glossary.generated';
import { GlossaryNodeFragment } from '../../../../graphql/fragments.generated';
import { ChildGlossaryTermFragment } from '../../../../graphql/glossaryNode.generated';
import { GlossaryNode, GlossaryTerm } from '../../../../types.generated';
import GlossaryEntityItem from '../../../glossary/GlossaryEntityItem';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { sortGlossaryTerms } from '../../../entity/glossaryTerm/utils';
import { sortGlossaryNodes } from '../../../entity/glossaryNode/utils';
import EntityRegistry from '../../../entity/EntityRegistry';
import { useEntityData } from '../../../entity/shared/EntityContext';
import TagTermGroup from '../../../shared/tags/TagTermGroup';
import { getNestedValue } from '../../../entity/shared/containers/profile/utils';
import { useMutationUrn, useRefetch } from '../../../entity/shared/EntityContext';
import { Tags } from '../../../entity/shared/SidebarStyledComponents';
import EditTagTermsModal from '../../../shared/tags/AddTagsTermsModal';

const StyledButton = styled(Button)`
    color: ${ANTD_GRAY[7]};
    width: 80%;
`;

const StyledRemoveIcon = styled(MinusCircleOutlined)`
    font-size: 14px;
    margin-left: 10px;
`;

interface CommonFieldProps {
    field: RecipeField;
    removeMargin?: boolean;
    glossaryNodes?: (GlossaryNode | GlossaryNodeFragment)[];
    glossaryTerms?: (GlossaryTerm | ChildGlossaryTermFragment)[];
    entityRegistry?: EntityRegistry;
    properties?: any;
    mutationUrn?: string;
    entityType?: EntityType
    entityData?: any;
    refetch?: () => Promise<any>;
}

const handleTagChange = (add: () => void, remove: (name: string) => void) => {
    // Example logic for adding and removing tags
    const addTag = () => {
        add();
    };

    const removeTag = (name: string) => {
        remove(name);
    };

    return { addTag, removeTag };
};

//const canAddTerm = properties?.hasTerms;

function TagListField({ field, removeMargin, entityData, entityType, refetch, glossaryNodes, glossaryTerms, entityRegistry, properties, mutationUrn }: CommonFieldProps) {
    const canAddTag = properties?.hasTags;
    return (
        <div>
        <StyledFormItem
            required={field.required}
            name={field.name}
            label={field.label}
            tooltip={field.tooltip}
            $removeMargin={!!removeMargin}
            rules={field.rules || undefined}
        >
            <TagTermGroup
                editableTags={
                    properties?.customTagPath
                        ? getNestedValue(entityData, properties?.customTagPath)
                        : entityData?.globalTags
                }
                canAddTag={true}
                canRemove={true}
                showEmptyMessage={false}
                entityUrn={mutationUrn}
                entityType={entityType}
                refetch={refetch}
                readOnly={false} //make dynamic from parent component
                fontSize={12}
            />
        </StyledFormItem>
        </div>
    )
}

interface Props {
    field: RecipeField;
    //secrets: Secret[];
    //refetchSecrets: () => void;
    removeMargin?: boolean;
    onOpenModal?: () => void;
    entitySubresource?: string;
    //updateFormValue: (field, value) => void;
}

function TagsField(props: Props) {
    const { field, removeMargin, onOpenModal, entitySubresource } = props;

    const [showAddModal, setShowAddModal] = React.useState(false);
    const [addModalType, setAddModalType] = React.useState(EntityType.Tag);
    const mutationUrn = useMutationUrn();
    const refetch = useRefetch();

    const { entityType, entityData } = useEntityData();
    console.log(entityType);
    const entityRegistry = useEntityRegistry();
    const {
        data: termsData,
        refetch: refetchForTerms,
        loading: termsLoading,
        error: termsError,
    } = useGetRootGlossaryTermsQuery();
    const {
        data: nodesData,
        refetch: refetchForNodes,
        loading: nodesLoading,
        error: nodesError,
    } = useGetRootGlossaryNodesQuery();

    console.log(termsData);
    console.log(nodesData);

    const terms = termsData?.getRootGlossaryTerms?.terms.sort((termA, termB) =>
        sortGlossaryTerms(entityRegistry, termA, termB),
    );
    const nodes = nodesData?.getRootGlossaryNodes?.nodes.sort((nodeA, nodeB) =>
        sortGlossaryNodes(entityRegistry, nodeA, nodeB),
    );

    return (
        <>
        {/*     {showAddModal && !!mutationUrn && !!entityType && (
                <EditTagTermsModal
                    type={addModalType}
                    open
                    onCloseModal={() => {
                        onOpenModal?.();
                        setShowAddModal(false);
                        refetch?.();
                    }}
                    resources={[
                        {
                            resourceUrn: mutationUrn,
                            subResource: entitySubresource,
                            subResourceType: entitySubresource ? SubResourceType.DatasetField : null,
                        },
                    ]}
                />
            )} */}
            <TagListField
                glossaryNodes={nodes}
                glossaryTerms={terms}
                entityRegistry={entityRegistry}
                entityData={entityData}
                entityType={entityType}
                mutationUrn={mutationUrn}
                refetch={refetch}
                field={field}
                removeMargin={removeMargin}
            />
        </>
    );

}

export default TagsField;
