import React, { useState, useCallback } from 'react';
import Panel from './Panel';
import { Box, Icon } from '@material-ui/core';
import FormMessage from './FormMessage';

const ProfilePanel = ({id, heading, expanded=true, FormComponent, DisplayComponent}) => {
  const [edit, setEdit] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const editInfo = useCallback(() => {
    setEdit(true);
    setFormSuccess(false);
  }, []);
  const cancelEdit = useCallback(() => setEdit(false), []);
  const formSubmitted = useCallback(() => {
    setFormSuccess(true);
    setEdit(false);
  }, []);
  return (
    <Panel id={id} heading={heading} expanded={expanded}>
      <Box width="100%">
        { edit && <FormComponent cancel={cancelEdit} formSubmitted={formSubmitted} /> }
        { !edit && <DisplayComponent editInfo={editInfo} />}
        { formSuccess && 
          <FormMessage success={true} >
            <Box display="flex">
              <Icon>done</Icon> Updated Successfully
            </Box>
          </FormMessage>  
        }
      </Box>
    </Panel>
  );
}
 
export default ProfilePanel;