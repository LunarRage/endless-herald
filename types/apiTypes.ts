export type landQuery = {
    page: number;
    limit: number;
    order: string;
    sort: string;
}

export type ApiResponse < T > = {
    data: T | null;
    error: {
        message: string;
        code ? : number;
    } | null;
};

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
    savanah: number;
    forest: number;
    arctic: number;
    mystic: number;
    genesis: number;
    total: number;
}