import { Socket } from 'socket.io-client';
import { Card } from './card';

export type BasePlayer =
{
    name: string;
    score: number;
    is_turn: boolean;
    current_card: Card;
};

export type Player = BasePlayer & {
    hand : Card[];
    user_id: string;
};
