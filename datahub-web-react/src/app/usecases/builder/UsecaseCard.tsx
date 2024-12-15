import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

import { REDESIGN_COLORS } from '../../entity/shared/constants';

const Container = styled(Button)`
    padding: 32px;
    height: 200px;
    display: flex;
    justify-content: center;
    border-radius: 8px;
    align-items: start;
    flex-direction: column;
    border: 1px solid #e0e0e0;
    background-color: #ffffff;
    &&:hover {
        border: 1px solid ${REDESIGN_COLORS.BLUE};
        background-color: #ffffff;
    }
    white-space: unset;
`;

const Title = styled.div`
    word-break: break-word;
    color: #464646;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 8px;
`;

const Description = styled.div`
    word-break: break-word;
    text-align: left;
    color: #7c7c7c;
`;

const Owner = styled.div`
    word-break: break-word;
    text-align: left;
    color: #7c7c7c;
`;

type Props = {
    name: string;
    description?: string;
    owner?: string;
    onClick?: () => void;
};

export const UsecaseCard = ({ name, description, owner, onClick }: Props) => {
    return (
        <Container type="link" onClick={onClick}>
            <Title>{name}</Title>
            <Owner>{owner}</Owner>
            <Description>{description}</Description>
        </Container>
    );
};
