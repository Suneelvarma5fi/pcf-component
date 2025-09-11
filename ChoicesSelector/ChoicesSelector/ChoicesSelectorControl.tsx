import * as React from "react";
import { IChoicesOption, IChoicesSelectorProps } from "./IChoicesSelectorProps";
import { v4 as uuidv4 } from 'uuid';

import {
  makeStyles,
  IdPrefixProvider,
  FluentProvider,
  Input,
  webLightTheme,
} from "@fluentui/react-components";
import { Tag, TagPicker, TagPickerControl, TagPickerGroup, TagPickerInput, TagPickerList, TagPickerOption, TagPickerProps } from '@fluentui/react-components'

const _useStyles = makeStyles({
    root: {
        width: "100%",
    
},
  tagPickerListContainer: {
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "4px",
    marginTop: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    zIndex: 1000,
    position: "absolute",
  },


});

export const ChoicesSelectorControl : React.FunctionComponent<IChoicesSelectorProps> = (props) => {
   
    const [placeholder, setPlaceholder] = React.useState<string>("---");
    const [selectedOptions, setSelectedOptions] = React.useState<IChoicesOption[]>(props.selectedValues || []);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState<boolean>(false); 
    const styles = _useStyles();
    const myTheme = props.isDisabled ? {
        ...props.theme,
        colorCompoundBrandStroke: props.theme?.colorNeutralStroke1,
        colorCompoundBrandStrokeHover: props.theme?.colorNeutralStroke1Hover,
        colorCompoundBrandStrokePressed: props.theme?.colorNeutralStroke1Pressed,
        colorCompoundBrandStrokeSelected: props.theme?.colorNeutralStroke1Selected,
        backgroundColor: props.theme?.colorNeutralBackground3,
        }
        :
        {
          ...webLightTheme
        };
        
  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {

    setSelectedOptions((prevSelectedOptions) => {
      if(data.value === "no-options") {
        return prevSelectedOptions;
      }

      const newSelectedOptions = data.selectedOptions.map((val) => ({
          text: props.availableOptions.find((option => option.value.toString() === val))?.text || "",
          value: parseInt(val),
          key : val
        }));

      props.onChange(newSelectedOptions);
      return newSelectedOptions;
    })
  }
  const tagPickerOptions = props.availableOptions.filter(
    (option) => !selectedOptions.find(so => so.key == option.key)
  );

  return (
     <div className={styles.root}>
          <IdPrefixProvider value={"csc_" +  uuidv4()}>
              <FluentProvider theme={myTheme}>
              {props.isDisabled?
              <Input
                  value={props.selectedValues?.map((option) => option.text).join(", ") ?? placeholder}          
                  appearance='filled-darker'
                  className={styles.root}
                  readOnly={true}        
                  /> 
              :
           
               <TagPicker
                onOptionSelect={onOptionSelect}
                selectedOptions={selectedOptions.map(option => (option.key))}
                appearance='filled-darker'
                size="large"
              >
                <TagPickerControl   className={styles.root}>
                  <TagPickerGroup aria-label="Selected Options">
                    {selectedOptions.sort((a, b) => a.text.localeCompare(b.text)).map(option => (
                      <Tag
                        key={option.key}
                        shape="rounded"
                        appearance="brand"
                        value={option.key}
                      >
                        {option.text}
                      </Tag>
                    ))}
                  </TagPickerGroup>  
                </TagPickerControl>
                <TagPickerList multiselect={true} className={styles.root} >
                  {
                   tagPickerOptions.length > 0 ? ( tagPickerOptions.map(option => (
                      <TagPickerOption
                        value={option.key}
                        key={option.key}
                      >
                        {option.text}
                        </TagPickerOption>
                    ))):(
                        <TagPickerOption value="no-options">
                          {props.context.resources.getString("NoOptionsAvailable")}
                        </TagPickerOption>
                    )
                  }
                </TagPickerList>
              </TagPicker>
              }
              </FluentProvider>
          </IdPrefixProvider>
   </div>
  );
}