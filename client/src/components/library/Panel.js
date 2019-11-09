import React, { useState, useEffect } from 'react';
import { ExpansionPanel, ExpansionPanelSummary, Typography, makeStyles, ExpansionPanelDetails } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
  },
  summary: {
    borderBottom: '1px solid',
    borderBottomColor: grey[400]
  },
  summaryContent: {
    margin: "10px 0px !important"
  }
}))

const Panel = ({id, heading, children, expanded }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(expanded);
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded])
  return (
  <ExpansionPanel expanded={isExpanded}>
    <ExpansionPanelSummary
      className={classes.summary}
      style={{ minHeight: '40px' }}
      classes={{
        content: classes.summaryContent
      }}
      expandIcon={<ExpandMoreIcon />}
      aria-controls={ id + "-content"}
      id={id+"-header"}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Typography className={classes.heading}>{heading}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      { children }
    </ExpansionPanelDetails>
  </ExpansionPanel> 
  );
}
 
export default Panel;