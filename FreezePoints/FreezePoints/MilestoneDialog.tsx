import * as React from "react";
import { IMilestoneFormData, IPspElement } from "./types";
import {
    Button,
    Input,
    Label,
    Text,
    tokens,
} from "@fluentui/react-components";
import { DismissIcon } from "./Icons";

interface IMilestoneDialogProps {
    element: IPspElement;
    onSave: (data: IMilestoneFormData) => void;
    onCancel: () => void;
    isSaving: boolean;
    errorMessage?: string | null;
}

export const MilestoneDialog: React.FC<IMilestoneDialogProps> = ({
    element,
    onSave,
    onCancel,
    isSaving,
    errorMessage,
}) => {
    const [form, setForm] = React.useState<IMilestoneFormData>({
        label: "",
        date: "",
    });

    const minDate = element.p6662_startdate ? element.p6662_startdate.substring(0, 10) : undefined;
    const maxDate = element.p6662_enddate ? element.p6662_enddate.substring(0, 10) : undefined;

    const isValid =
        form.label.trim().length > 0 &&
        form.date.length > 0 &&
        (!minDate || form.date >= minDate) &&
        (!maxDate || form.date <= maxDate);

    return (
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
            <div
                style={{
                    backgroundColor: tokens.colorNeutralBackground1,
                    borderRadius: "12px",
                    boxShadow: tokens.shadow64,
                    width: "520px",
                    maxWidth: "90vw",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
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
                        Add Milestone v0.0.12
                    </Text>
                    <Button
                        appearance="subtle"
                        icon={<DismissIcon />}
                        onClick={onCancel}
                        size="small"
                        disabled={isSaving}
                    />
                </div>

                <div style={{ padding: "20px 24px" }}>
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: "block", marginBottom: "12px" }}>
                        {element.p6662_name}
                    </Text>

                    <div style={{ marginBottom: "12px" }}>
                        <Label htmlFor="milestone-label" required>Milestone Label</Label>
                        <Input
                            id="milestone-label"
                            value={form.label}
                            onChange={(_, data) => setForm((prev) => ({ ...prev, label: data.value }))}
                            style={{ width: "100%" }}
                            disabled={isSaving}
                            placeholder="Enter milestone name"
                        />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                        <Label htmlFor="milestone-date" required>Milestone Date</Label>
                        <Input
                            id="milestone-date"
                            type="date"
                            min={minDate}
                            max={maxDate}
                            value={form.date}
                            onChange={(_, data) => setForm((prev) => ({ ...prev, date: data.value }))}
                            style={{ width: "100%" }}
                            disabled={isSaving}
                        />
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: "block", marginTop: "6px" }}>
                            Date must be between {minDate ?? "start"} and {maxDate ?? "end"}.
                        </Text>
                    </div>

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
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                        padding: "16px 24px",
                        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
                    }}
                >
                    <Button appearance="secondary" onClick={onCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        style={{ backgroundColor: "#c50f1f", color: "#ffffff", borderColor: "#c50f1f" }}
                        onClick={() => onSave(form)}
                        disabled={!isValid || isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Milestone"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
