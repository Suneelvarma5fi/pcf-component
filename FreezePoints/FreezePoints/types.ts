export interface ICheckpoint {
    p6662_checkpointsid?: string;
    p6662_name: string;    // label
    p6662_date: string;    // ISO date string
    _p6662_pspelement_value?: string;
}

export interface IPspElement {
    p6662_pspelementid?: string;
    p6662_name: string;
    p6662_startdate: string;  // ISO date string
    p6662_enddate: string;    // ISO date string
    _p6662_order_value?: string;
    p6662_checkpoints_PSPElement_p6662_pspelement?: ICheckpoint[];
}

export interface IPspElementFormData {
    existingId?: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface IMilestoneFormData {
    label: string;
    date: string;
}
