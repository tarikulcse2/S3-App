import { ITrade } from './trade';

export interface IPaging {
    page: number;
    size: number;
    totalPage: number;
    data: ITrade[];
}
