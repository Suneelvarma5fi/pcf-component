import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FreezePointsContainer, IFreezePointsContainerProps } from "./FreezePointsContainer";
import { DataverseService } from "./DataverseService";
import * as React from "react";

export class FreezePointsV2 implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private service: DataverseService;
    private orderId: string;

    constructor() {
        // Empty
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.service = new DataverseService(context.webAPI);

        // Extract the current order ID from the page context
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        const ctxAny = context as unknown as Record<string, Record<string, string>>;
        this.orderId = ctxAny.page?.entityId ?? ctxAny.page?.entityTypeName ?? "";
        // Also try mode.contextInfo if page.entityId is unavailable
        if (!this.orderId) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const modeAny = (context as unknown as Record<string, Record<string, Record<string, string>>>).mode;
            this.orderId = modeAny?.contextInfo?.entityId ?? "";
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: IFreezePointsContainerProps = {
            orderId: this.orderId,
            service: this.service,
        };
        return React.createElement(FreezePointsContainer, props);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup if necessary
    }
}
