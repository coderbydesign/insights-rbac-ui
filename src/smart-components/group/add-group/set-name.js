import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormHelperText, HelperText, HelperTextItem, Stack, StackItem } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { TextInput } from '@patternfly/react-core/dist/esm/components/TextInput/TextInput';
import { TextArea } from '@patternfly/react-core/dist/esm/components/TextArea/TextArea';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/FormGroup';
import { debouncedAsyncValidator } from '../validators';
import { useIntl } from 'react-intl';
import messages from '../../../Messages';

const groupNameValidated = (groupName, groupNameError) =>
  groupName === undefined || groupNameError || groupName?.length > 150 ? 'error' : 'default';
const groupDescriptionValidated = (groupDescription) => (groupDescription?.length > 150 ? 'error' : 'default');

const SetName = (props) => {
  const intl = useIntl();
  const { input } = useFieldApi(props);
  const formOptions = useFormApi();
  const { 'group-name': name, 'group-description': description } = formOptions.getState().values;
  const [groupName, setGroupName] = useState(name || '');
  const [groupNameError, setGroupNameError] = useState();
  const [groupDescription, setGroupDescription] = useState(description);

  const processGroupName = (value) => {
    input.onChange(undefined);
    debouncedAsyncValidator(value)
      .then(() => {
        input.onChange(value);
        setGroupNameError(undefined);
      })
      .catch((error) => {
        setGroupNameError(error);
        input.onChange(undefined);
      });
    setGroupName(value);
  };

  useEffect(() => {
    groupName?.length > 0 && processGroupName(groupName);
  }, []);

  const groupNameValid = groupNameValidated(groupName, groupNameError);
  const groupDescriptionValid = groupDescriptionValidated(groupDescription);
  return (
    <Stack hasGutter>
      <StackItem className="rbac-l-stack__item-summary">
        <FormGroup label={intl.formatMessage(messages.groupName)} isRequired>
          <TextInput
            value={groupName}
            type="text"
            validated={groupNameValid}
            onBlur={() => groupName === '' && setGroupName(undefined)}
            onChange={(_event, value) => processGroupName(value)}
            aria-label="Group name"
          />
          {groupNameValid === 'error' && (
            <FormHelperText>
              <HelperText>
                <HelperTextItem variant={groupNameValid}>{groupName ? groupNameError : intl.formatMessage(messages.required)}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      </StackItem>
      <StackItem>
        <FormGroup label={intl.formatMessage(messages.groupDescription)}>
          <TextArea
            value={groupDescription}
            validated={groupDescriptionValid}
            onChange={(_event, value) => {
              setGroupDescription(value);
              formOptions.change('group-description', value);
            }}
            aria-label="Group description"
            resizeOrientation="vertical"
          />
          {groupDescriptionValid === 'error' && (
            <FormHelperText>
              <HelperText variant={groupDescriptionValid}>
                <HelperTextItem>{intl.formatMessage(messages.maxCharactersWarning, { number: 150 })}</HelperTextItem>
              </HelperText>
            </FormHelperText>
          )}
        </FormGroup>
      </StackItem>
    </Stack>
  );
};

SetName.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  groups: PropTypes.array,
};

export default SetName;
