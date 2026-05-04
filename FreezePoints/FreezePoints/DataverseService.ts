import { ICheckpoint, IPspElement } from "./types";

type WebApi = ComponentFramework.WebApi;

const PSP_TABLE = "p6662_pspelement";
const PSP_TABLE_SET = "p6662_pspelements";
const CHECKPOINT_TABLE = "p6662_checkpoints";
const CHECKPOINT_TABLE_SET = "p6662_checkpointses";

// Navigation property name for the 1:N relationship from PSP Element to Checkpoints.
const CHECKPOINT_NAV_PROPERTY = "p6662_checkpoints_PSPElement_p6662_pspelement";

export class DataverseService {
    private webAPI: WebApi;

    constructor(webAPI: WebApi) {
        this.webAPI = webAPI;
    }

    /**
     * Fetch all PSP elements for a given order, with checkpoints expanded and ordered by date ascending.
     */
    async fetchPspElements(orderId: string): Promise<IPspElement[]> {
        const query =
            `?$filter=_p6662_order_value eq '${orderId}'` +
            `&$expand=${CHECKPOINT_NAV_PROPERTY}($orderby=p6662_date asc)`;

        const result = await this.webAPI.retrieveMultipleRecords(PSP_TABLE, query);
        return result.entities as IPspElement[];
    }

    /**
     * Create a new PSP element linked to an order.
     */
    async createPspElement(orderId: string, name: string, startDate: string, endDate: string): Promise<string> {
        const record: ComponentFramework.WebApi.Entity = {
            p6662_name: name,
            p6662_startdate: startDate,
            p6662_enddate: endDate,
            "p6662_Order@odata.bind": `/p6662_orders(${orderId})`,
        };
        const result = await this.webAPI.createRecord(PSP_TABLE, record);
        return result.id.replace(/[{}]/g, "");
    }

    /**
     * Update an existing PSP element.
     */
    async updatePspElement(pspElementId: string, name: string, startDate: string, endDate: string): Promise<void> {
        const record: ComponentFramework.WebApi.Entity = {
            p6662_name: name,
            p6662_startdate: startDate,
            p6662_enddate: endDate,
        };
        await this.webAPI.updateRecord(PSP_TABLE, pspElementId, record);
    }

    /**
     * Delete a PSP element (cascade deletes checkpoints).
     */
    async deletePspElement(pspElementId: string): Promise<void> {
        await this.webAPI.deleteRecord(PSP_TABLE, pspElementId);
    }

    /**
     * Create a checkpoint linked to a PSP element.
     */
    async createCheckpoint(pspElementId: string, label: string, date: string): Promise<string> {
        const record: ComponentFramework.WebApi.Entity = {
            p6662_name: label,
            p6662_date: date,
            [`p6662_pspelement@odata.bind`]: `/${PSP_TABLE_SET}(${pspElementId})`,
        };
        const result = await this.webAPI.createRecord(CHECKPOINT_TABLE, record);
        return result.id.replace(/[{}]/g, "");
    }

    /**
     * Update an existing checkpoint.
     */
    async updateCheckpoint(checkpointId: string, label: string, date: string): Promise<void> {
        const record: ComponentFramework.WebApi.Entity = {
            p6662_name: label,
            p6662_date: date,
        };
        await this.webAPI.updateRecord(CHECKPOINT_TABLE, checkpointId, record);
    }

    /**
     * Delete a checkpoint.
     */
    async deleteCheckpoint(checkpointId: string): Promise<void> {
        await this.webAPI.deleteRecord(CHECKPOINT_TABLE, checkpointId);
    }

    /**
     * Save a full PSP element with its checkpoints.
     * Handles create/update for the element and create/update/delete for checkpoints.
     */
    async savePspElement(
        orderId: string,
        existingId: string | undefined,
        name: string,
        startDate: string,
        endDate: string,
        checkpoints: { existingId?: string; label: string; date: string }[],
        originalCheckpointIds: string[]
    ): Promise<void> {
        // Create or update the PSP element
        let pspElementId: string;
        if (existingId) {
            await this.updatePspElement(existingId, name, startDate, endDate);
            pspElementId = existingId;
        } else {
            pspElementId = await this.createPspElement(orderId, name, startDate, endDate);
        }

        // Determine which checkpoints to delete (existed before but not in current list)
        const currentExistingIds = new Set(
            checkpoints.filter((c) => c.existingId).map((c) => c.existingId!)
        );
        const toDelete = originalCheckpointIds.filter((id) => !currentExistingIds.has(id));

        // Delete removed checkpoints
        for (const id of toDelete) {
            await this.deleteCheckpoint(id);
        }

        // Create or update remaining checkpoints
        for (const cp of checkpoints) {
            if (cp.existingId) {
                await this.updateCheckpoint(cp.existingId, cp.label, cp.date);
            } else {
                await this.createCheckpoint(pspElementId, cp.label, cp.date);
            }
        }
    }
}
