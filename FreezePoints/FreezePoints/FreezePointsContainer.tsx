import * as React from "react";
import { IMilestoneFormData, IPspElement, IPspElementFormData } from "./types";
import { DataverseService } from "./DataverseService";
import { PspElementBlock } from "./PspElementBlock";
import { PspElementFormDialog } from "./PspElementFormDialog";
import { MilestoneDialog } from "./MilestoneDialog";
import {
    Button,
    Spinner,
    Text,
    tokens,
} from "@fluentui/react-components";
import { AddIcon } from "./Icons";

export interface IFreezePointsContainerProps {
    orderId: string;
    service: DataverseService;
}

type DialogMode =
    | { kind: "closed" }
    | { kind: "add" }
    | { kind: "edit"; element: IPspElement };

type MilestoneDialogMode =
    | { kind: "closed" }
    | { kind: "add"; element: IPspElement };

function getErrorMessage(err: unknown): string {
    if (err instanceof Error && err.message) {
        return err.message;
    }

    if (typeof err === "string") {
        return err;
    }

    if (typeof err === "object" && err !== null) {
        const maybeMessage = (err as { message?: unknown }).message;
        if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
            return maybeMessage;
        }

        const maybeError = (err as { error?: { message?: unknown } }).error;
        const nestedMessage = maybeError?.message;
        if (typeof nestedMessage === "string" && nestedMessage.length > 0) {
            return nestedMessage;
        }

        const maybeResponse = (err as { responseText?: unknown }).responseText;
        if (typeof maybeResponse === "string" && maybeResponse.length > 0) {
            return maybeResponse;
        }

        try {
            return JSON.stringify(err);
        } catch {
            // Fall through to generic fallback.
        }
    }

    return "Unexpected error occurred.";
}

export const FreezePointsContainer: React.FC<IFreezePointsContainerProps> = ({
    orderId,
    service,
}) => {
    const [elements, setElements] = React.useState<IPspElement[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [dialogMode, setDialogMode] = React.useState<DialogMode>({ kind: "closed" });
    const [milestoneDialogMode, setMilestoneDialogMode] = React.useState<MilestoneDialogMode>({ kind: "closed" });
    const [isSaving, setIsSaving] = React.useState(false);
    const [isMilestoneSaving, setIsMilestoneSaving] = React.useState(false);

    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await service.fetchPspElements(orderId);
            setElements(data);
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [orderId, service]);

    React.useEffect(() => {
        void loadData();
    }, [loadData]);

    const [saveError, setSaveError] = React.useState<string | null>(null);
    const [milestoneError, setMilestoneError] = React.useState<string | null>(null);

    const handleSave = async (data: IPspElementFormData) => {
        try {
            setIsSaving(true);
            setSaveError(null);
            setError(null);

            if (!orderId) {
                throw new Error("Order ID is not available. Please open this control from an Order record.");
            }

            if (data.existingId) {
                await service.updatePspElement(data.existingId, data.name, data.startDate, data.endDate);
            } else {
                await service.createPspElement(orderId, data.name, data.startDate, data.endDate);
            }

            setSaveError(null);
            setDialogMode({ kind: "closed" });
            await loadData();
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setSaveError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (elementId: string) => {
        try {
            setError(null);
            await service.deletePspElement(elementId);
            await loadData();
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setError(message);
        }
    };

    const handleEdit = (element: IPspElement) => {
        setDialogMode({ kind: "edit", element });
    };

    const handleOpenAddMilestone = (element: IPspElement) => {
        setMilestoneError(null);
        setMilestoneDialogMode({ kind: "add", element });
    };

    const handleSaveMilestone = async (data: IMilestoneFormData) => {
        if (milestoneDialogMode.kind !== "add") {
            return;
        }
        try {
            setIsMilestoneSaving(true);
            setMilestoneError(null);
            const pspElementId = milestoneDialogMode.element.p6662_pspelementid;
            if (!pspElementId) {
                throw new Error("Cannot add milestone. PSP element ID is missing.");
            }
            await service.createCheckpoint(pspElementId, data.label, data.date);
            setMilestoneDialogMode({ kind: "closed" });
            await loadData();
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            setMilestoneError(message);
        } finally {
            setIsMilestoneSaving(false);
        }
    };

    const handleCloseDialog = () => {
        setSaveError(null);
        setDialogMode({ kind: "closed" });
    };

    if (loading) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <Spinner size="medium" label="Loading Freezepoints..." />
            </div>
        );
    }

    return (
        <div style={{ width: "100%", minHeight: "100%", padding: "20px 24px" }}>
            {/* Header row: title left, create button right */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <Text weight="semibold" size={500}>
                    Freezepoints v0.0.12
                </Text>
                <Button
                    appearance="primary"
                    icon={<AddIcon />}
                    style={{ backgroundColor: "#c50f1f", color: "#ffffff", borderColor: "#c50f1f" }}
                    onClick={() => setDialogMode({ kind: "add" })}
                >
                    Create Freezepoint v012
                </Button>
            </div>

            {/* Error banner */}
            {error && (
                <Text
                    size={200}
                    style={{
                        color: tokens.colorPaletteRedForeground1,
                        display: "block",
                        marginBottom: "12px",
                    }}
                >
                    {error}
                </Text>
            )}

            {/* Empty state */}
            {elements.length === 0 && (
                <div
                    style={{
                        padding: "48px 24px",
                        textAlign: "center",
                        color: tokens.colorNeutralForeground3,
                    }}
                >
                    <Text size={300}>
                        No freezepoints created yet. Click &quot;Create Freezepoint&quot; to add one.
                    </Text>
                </div>
            )}

            {/* Freezepoints list */}
            {elements.map((el) => (
                <PspElementBlock
                    key={el.p6662_pspelementid}
                    element={el}
                    onEdit={handleEdit}
                    onAddMilestone={handleOpenAddMilestone}
                    onDelete={(id) => { void handleDelete(id); }}
                />
            ))}

            {/* Dialog for add/edit */}
            {dialogMode.kind !== "closed" && (
                <PspElementFormDialog
                    editingElement={dialogMode.kind === "edit" ? dialogMode.element : undefined}
                    onSave={(data) => { void handleSave(data); }}
                    onCancel={handleCloseDialog}
                    isSaving={isSaving}
                    errorMessage={saveError}
                />
            )}

            {/* Dialog for milestone add (one-by-one) */}
            {milestoneDialogMode.kind === "add" && (
                <MilestoneDialog
                    element={milestoneDialogMode.element}
                    onSave={(data) => { void handleSaveMilestone(data); }}
                    onCancel={() => {
                        setMilestoneError(null);
                        setMilestoneDialogMode({ kind: "closed" });
                    }}
                    isSaving={isMilestoneSaving}
                    errorMessage={milestoneError}
                />
            )}
        </div>
    );
};
