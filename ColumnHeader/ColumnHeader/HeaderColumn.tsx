import * as React from 'react';
import { FluentProvider, IdPrefixProvider, Label, makeStyles, Theme } from '@fluentui/react-components';
import { v4 as uuidv4 } from 'uuid';

export interface IHeaderColumnProps {
  name?: string;
   theme?: Theme,
}
  const _useStyles = makeStyles({
    root: {
        fontWeight:600
    }
});
export const HeaderColumn : React.FunctionComponent<IHeaderColumnProps> = (props) => {

   const styles = _useStyles();
    

    return (
      <IdPrefixProvider value={"hc_" +  uuidv4()}>
        <FluentProvider theme={props.theme}>
          <Label className={styles.root}>{props.name}</Label>
        </FluentProvider>
      </IdPrefixProvider>
    )
  
}
