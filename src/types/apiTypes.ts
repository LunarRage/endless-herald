export type landQuery = {
    page: number;
    limit: number;
    order: string;
    sort: string;
}

export type LandAPIResponse= {
    data: LandData[] | null;
    total: number;
};

export type RoninUser = {
    rnsName: string;
    roninAddress: string;
}

export type Broadcasted ={
    id:string;
    created_at: string | Date;
}

export type LastBroadcasted = {
    broadcasted:Broadcasted[];
}

export type LandData = {
    id: string;
    owner: string;
    status: string;
    short_detail: string;
    expiration: number;
    listing_expired_in: number;
    listing_expired_at: string;
    created_at: string;
    avg_earning: AvgEarning;
    contract_term: ContractTerm;
    payment_model: PaymentModel;
    land: Land;
}

export type PaymentModel = {
    owner: number;
    partner: number;
    type: string;
}

export type ContractTerm = {
    type: string;
    termination_rule: string;
    restriction_level: number;
}

export type AvgEarning = {
    token: number;
    unit: string;
    schedule: string;
}

export type Land = {
    savanah?: number;
    forest?: number;
    arctic?: number;
    mystic?: number;
    genesis?: number;
    total: number;
}