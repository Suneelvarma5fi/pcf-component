import * as React from "react";
import { IPspElement, IPspElementFormData } from "./types";
import {
    Button,
    Input,
    Label,
    Text,
    tokens,
} from "@fluentui/react-components";
import { DismissIcon } from "./Icons";

interface IPspElementFormDialogProps {
    editingElement?: IPspElement;
    onSave: (data: IPspElementFormData) => void;
    onCancel: () => void;
    isSaving: boolean;
    errorMessage?: string | null;
}

function toFormData(element?: IPspElement): IPspElementFormData {
    if (!element) {
        return { name: "", startDate: "", endDate: "" };
    }
    return {
        existingId: element.p6662_pspelementid,
        name: element.p6662_name,
        startDate: element.p6662_startdate ? element.p6662_startdate.substring(0, 10) : "",
        endDate: element.p6662_enddate ? element.p6662_enddate.substring(0, 10) : "",
    };
}

export const PspElementFormDialog: React.FC<IPspElementFormDialogProps> = ({
    editingElement,
    onSave,
    onCancel,
    isSaving,
    errorMessage,
}) => {
    const [form, setForm] = React.useState<IPspElementFormData>(() =>
        toFormData(editingElement)
    );

    React.useEffect(() => {
        setForm(toFormData(editingElement));
    }, [editingElement]);

    const isValid =
        form.name.trim().length > 0 &&
        form.startDate.length > 0 &&
        form.endDate.length > 0 &&
        form.startDate <= form.endDate;

    const updateField = (field: keyof IPspElementFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        /* Overlay backdrop */
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000000,
            }}
        >
            {/* Dialog panel */}
            <div
                style={{
                    backgroundColor: tokens.colorNeutralBackground1,
                    borderRadius: "12px",
                    boxShadow: tokens.shadow64,
                    width: "560px",
                    maxWidth: "90vw",
                    maxHeight: "85vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Dialog header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px 16px",
                        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
                    }}
                >
                    <Text weight="semibold" size={500}>
                        {editingElement ? "Edit Freezepoint v0.0.12" : "Create Freezepoint v0.0.12"}
                    </Text>
                    <Button
                        appearance="subtle"
                        icon={<DismissIcon />}
                        onClick={onCancel}
                        size="small"
                        disabled={isSaving}
                    />
                </div>

                {/* Dialog body — scrollable */}
                <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
                    {/* Name */}
                    <div style={{ marginBottom: "12px" }}>
                        <Label htmlFor="psp-name" required>Name</Label>
                        <Input
                            id="psp-name"
                            value={form.name}
                            onChange={(_, data) => updateField("name", data.value)}
                            style={{ width: "100%" }}
                            disabled={isSaving}
                            placeholder="Enter freezepoint name"
                        />
                    </div>

                    {/* Start / End dates */}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ flex: 1 }}>
                            <Label htmlFor="psp-start" required>Start Date</Label>
                            <Input
                                id="psp-start"
                                type="date"
                                value={form.startDate}
                                onChange={(_, data) => updateField("startDate", data.value)}
                                style={{ width: "100%" }}
                                disabled={isSaving}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Label htmlFor="psp-end" required>End Date</Label>
                            <Input
                                id="psp-end"
                                type="date"
                                value={form.endDate}
                                onChange={(_, data) => updateField("endDate", data.value)}
                                style={{ width: "100%" }}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    {form.startDate && form.endDate && form.startDate > form.endDate && (
                        <Text
                            size={200}
                            style={{ color: tokens.colorPaletteRedForeground1, marginBottom: "12px", display: "block" }}
                        >
                            Start date must be on or before end date.
                        </Text>
                    )}

                    <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        Save this freezepoint first. Add milestones one-by-one from the list.
                    </Text>
                </div>

                {/* Dialog footer */}
                <div
                    style={{
                        padding: "16px 24px",
                        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
                    }}
                >
                    {errorMessage && (
                        <Text
                            size={200}
                            style={{
                                color: tokens.colorPaletteRedForeground1,
                                display: "block",
                                marginBottom: "12px",
                            }}
                        >
                            Error: {errorMessage}
                        </Text>
                    )}
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <Button appearance="secondary" onClick={onCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        style={{ backgroundColor: "#c50f1f", color: "#ffffff", borderColor: "#c50f1f" }}
                        onClick={() => onSave(form)}
                        disabled={!isValid || isSaving}
                    >
                        {isSaving ? "Saving v012..." : "Save v012"}
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
