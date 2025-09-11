import { Theme } from "@fluentui/react-components";
import { IInputs } from "./generated/ManifestTypes";

export interface IChoicesOption{
    text: string;
    key: string;
    value: number;
}

export interface IChoicesSelectorProps {
    selectedValues: IChoicesOption[] | undefined;
    availableOptions: IChoicesOption[];
    isDisabled: boolean;
    onChange: (selectedOptions?: IChoicesOption[]) => void;
    theme?: Theme,
    context: ComponentFramework.Context<IInputs>
}