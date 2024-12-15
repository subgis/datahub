import { Modal, Steps, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { isEqual } from 'lodash';
import { UsecaseBuilderState, StepProps } from './types';
import { CreateScheduleStep } from './CreateScheduleStep';
import { DefineRecipeStep } from './DefineRecipeStep';
import { NameSourceStep } from './NameSourceStep';
import { SelectTemplateStep } from './SelectTemplateStep';
import usecaseTemplatesJSON from './usecaseTemplates.json';

const StyledModal = styled(Modal)`
    && .ant-modal-content {
        border-radius: 16px;
        overflow: hidden;
        min-width: 400px;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    border-radius: 12px;
`;

const StepsContainer = styled.div`
    margin-right: 20px;
    margin-left: 20px;
    margin-bottom: 40px;
`;

/**
 * Mapping from the step type to the title for the step
 */
export enum IngestionSourceBuilderStepTitles {
    SELECT_TEMPLATE = 'Choose Data Source',
    DEFINE_USE_CASE = 'Configure Connection',
    DEFINE_DATA = 'Sync Schedule',
    SHARE_USE_CASE = 'Finish up',
}

/**
 * Mapping from the step type to the component implementing that step.
 */
export const IngestionSourceBuilderStepComponent = {
    SELECT_TEMPLATE: SelectTemplateStep,
    DEFINE_USE_CASE: DefineRecipeStep,
    DEFINE_DATA: CreateScheduleStep,
    SHARE_USE_CASE: NameSourceStep,
};

/**
 * Steps of the Ingestion Source Builder flow.
 */
export enum UsecaseBuilderSteps {
    SELECT_TEMPLATE = 'SELECT_TEMPLATE',
    DEFINE_USE_CASE = 'DEFINE_USE_CASE',
    DEFINE_DATA = 'DEFINE_DATA',
    SHARE_USE_CASE = 'SHARE_USE_CASE',
}

const modalBodyStyle = { padding: '16px 24px 16px 24px', backgroundColor: '#F6F6F6' };

type Props = {
    initialState?: UsecaseBuilderState;
    open: boolean;
    onSubmit?: (input: UsecaseBuilderState, resetState: () => void, shouldRun?: boolean) => void;
    onCancel?: () => void;
};

export const UsecaseBuilderModal = ({ initialState, open, onSubmit, onCancel }: Props) => {
    const isEditing = initialState !== undefined;
    const titleText = isEditing ? 'Edit Use Case' : 'Create Use Case';
    const initialStep = isEditing
        ? UsecaseBuilderSteps.DEFINE_USE_CASE
        : UsecaseBuilderSteps.SELECT_TEMPLATE;

    const [stepStack, setStepStack] = useState([initialStep]);
    const [ingestionBuilderState, setIngestionBuilderState] = useState<UsecaseBuilderState>({
        schedule: {
            interval: '0 0 * * *',
        },
    });

    const usecaseTemplatesData = JSON.parse(JSON.stringify(usecaseTemplatesJSON)); // TODO: replace with call to server once we have access to dynamic list of sources

    // Reset the ingestion builder modal state when the modal is re-opened.
    const prevInitialState = useRef(initialState);
    useEffect(() => {
        if (!isEqual(prevInitialState.current, initialState)) {
            setIngestionBuilderState(initialState || {});
        }
        prevInitialState.current = initialState;
    }, [initialState]);

    // Reset the step stack to the initial step when the modal is re-opened.
    useEffect(() => setStepStack([initialStep]), [initialStep]);

    const goTo = (step: UsecaseBuilderSteps) => {
        setStepStack([...stepStack, step]);
    };

    const prev = () => {
        setStepStack(stepStack.slice(0, -1));
    };

    const cancel = () => {
        onCancel?.();
    };

    const submit = (shouldRun?: boolean) => {
        onSubmit?.(
            ingestionBuilderState,
            () => {
                setStepStack([initialStep]);
                setIngestionBuilderState({});
            },
            shouldRun,
        );
    };

    const currentStep = stepStack[stepStack.length - 1];
    const currentStepIndex = Object.values(UsecaseBuilderSteps)
        .map((value, index) => ({
            value,
            index,
        }))
        .filter((obj) => obj.value === currentStep)[0].index;
    const StepComponent: React.FC<StepProps> = IngestionSourceBuilderStepComponent[currentStep];

    return (
        <StyledModal
            width="90%"
            footer={null}
            title={
                <TitleContainer>
                    <Typography.Text>{titleText}</Typography.Text>
                </TitleContainer>
            }
            style={{ top: 40 }}
            bodyStyle={modalBodyStyle}
            open={open}
            onCancel={onCancel}
        >
            {currentStepIndex > 0 ? (
                <StepsContainer>
                    <Steps current={currentStepIndex}>
                        {Object.keys(UsecaseBuilderSteps).map((item) => (
                            <Steps.Step key={item} title={IngestionSourceBuilderStepTitles[item]} />
                        ))}
                    </Steps>
                </StepsContainer>
            ) : null}
            <StepComponent
                state={ingestionBuilderState}
                updateState={setIngestionBuilderState}
                goTo={goTo}
                prev={stepStack.length > 1 ? prev : undefined}
                submit={submit}
                cancel={cancel}
                usecaseTemplates={usecaseTemplatesData}
            />
        </StyledModal>
    );
};
