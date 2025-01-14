import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import React from 'react';

type Props = {
    icon: React.ReactNode;
    title: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    color?: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    style?: React.CSSProperties;
    disabled?: boolean
}

export default function ActionBtn({ icon, title, className, onClick, color, type, style, disabled }: Props) {

    const StyledButton = styled.button`
        padding: 0 8px; 
        height: 40px;
        border: 2px solid ${({ color, disabled }) => disabled ? '#CFCFCF' : color ?? '#153448'};
        border-radius: 0 8px 8px 0; 
        color: ${({ color, disabled }) => disabled ? '#CFCFCF' : color ?? '#153448'};
        transition: background-color 0.3s, color 0.3s;
        background-color: white;
        &:hover {
            background-color: ${({ color, disabled }) => disabled ? 'white' : color ?? '#153448'};
            color: ${({ disabled }) => disabled ? '#CFCFCF' : 'white'};
        }
    `;

    return (
        <div className={className} onClick={disabled ? undefined : onClick}>
            <div className="flex justify-center items-center">
                <div
                    style={{
                        backgroundColor: disabled ? '#CFCFCF' : color ?? '#153448',
                        borderColor: disabled ? '#CFCFCF' : color ?? '#153448'
                    }}
                    className={`${disabled ? '' : 'cursor-pointer'} text-white border-l-2 border-y-2 rounded-l-lg w-8 h-10 flex justify-center items-center`}>
                    {icon}
                </div>
                <StyledButton style={style} color={color} type={type} disabled={disabled}>
                    <Typography variant="button" className='font-light'>
                        {title}
                    </Typography>
                </StyledButton>
            </div>
        </div>
    );
}
