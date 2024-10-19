import {Schema} from "mongoose";

export interface splitUserInterface {
    user_id: Schema.Types.ObjectId;
    amount: number;
    percentage?: number;
    ispaid: boolean;
    last_notification: Date;
}

export interface splitInterface {
    name: string;
    description: string;
    amount: number;
    createdBy: Schema.Types.ObjectId;
    splitWith: splitUserInterface[];
    image: string[];
    settled: boolean;
}
