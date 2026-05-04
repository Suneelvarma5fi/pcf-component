import * as React from "react";
import { IPspElement } from "./types";
import { TimelineSvg } from "./TimelineSvg";
import {
    Button,
    Text,
    tokens,
} from "@fluentui/react-components";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    EditIcon,
    DeleteIcon,
    AddIcon,
} from "./Icons";

interface IPspElementBlockProps {
    element: IPspElement;
    onEdit: (element: IPspElement) => void;
    onDelete: (elementId: string) => void;
    onAddMilestone: (element: IPspElement) => void;
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export const PspElementBlock: React.FC<IPspElementBlockProps> = ({
    element,
    onEdit,
    onDelete,
    onAddMilestone,
}) => {
    const [expanded, setExpanded] = React.useState(true);

    const checkpoints = element.p6662_checkpoints_PSPElement_p6662_pspelement ?? [];

    return (
        <div
            style={{
                border: `1px solid ${tokens.colorNeutralStroke1}`,
                borderRadius: "8px",
                marginBottom: "12px",
                backgroundColor: tokens.colorNeutralBackground1,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: expanded
                        ? `1px solid ${tokens.colorNeutralStroke2}`
                        : "none",
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", color: tokens.colorNeutralForeground3 }}>
                        {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                    <div>
                        <Text weight="semibold" size={400} block>
                            {element.p6662_name}
                        </Text>
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                            {formatDate(element.p6662_startdate)} — {formatDate(element.p6662_enddate)}
                            {checkpoints.length > 0 && ` · ${checkpoints.length} checkpoint${checkpoints.length > 1 ? "s" : ""}`}
                        </Text>
                    </div>
                </div>
                <div
                    style={{ display: "flex", gap: "4px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        appearance="subtle"
                        icon={<AddIcon />}
                        onClick={() => onAddMilestone(element)}
                        size="small"
                    >
                        Add Milestone
                    </Button>
                    <Button
                        appearance="subtle"
                        icon={<EditIcon />}
                        onClick={() => onEdit(element)}
                        size="small"
                    />
                    <Button
                        appearance="subtle"
                        icon={<DeleteIcon />}
                        onClick={() => onDelete(element.p6662_pspelementid!)}
                        size="small"
                    />
                </div>
            </div>

            {/* Timeline visualization */}
            {expanded && (
                <div style={{ padding: "12px 16px 16px" }}>
                    <TimelineSvg
                        startDate={element.p6662_startdate}
                        endDate={element.p6662_enddate}
                        checkpoints={checkpoints}
                    />
                </div>
            )}
        </div>
    );
};
