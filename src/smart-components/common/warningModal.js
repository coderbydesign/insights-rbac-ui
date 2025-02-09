import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalVariant, Button, Icon } from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-triangle-icon';
import { useIntl } from 'react-intl';
import messages from '../../Messages';
import './warningModal.scss';

export const WarningModal = ({
  type,
  isOpen,
  onModalCancel,
  onModalConfirm,
  customTitle,
  customDescription,
  customPrimaryButtonTitle,
  customSecondaryButtonTitle,
}) => {
  const intl = useIntl();
  return (
    <Modal
      data-testid="warning-modal"
      title={
        <span className="rbac-c-wizard__cancel-warning-header">
          <Icon size="lg" className="pf-v5-u-mr-md">
            <ExclamationTriangleIcon className="rbac-c-wizard__cancel-warning-header--icon" />
          </Icon>
          {customTitle || intl.formatMessage(messages.exitItemCreation, { item: type })}
        </span>
      }
      variant={ModalVariant.small}
      className="rbac rbac-c-wizard__cancel-warning"
      isOpen={isOpen}
      onClose={onModalCancel}
      actions={[
        <Button ouiaId="primary-exit-button" key="confirm" variant="primary" onClick={onModalConfirm}>
          {customPrimaryButtonTitle ?? intl.formatMessage(messages.exit)}
        </Button>,
        <Button ouiaId="secondary-cancel-button" key="cancel" variant="link" onClick={onModalCancel}>
          {customSecondaryButtonTitle ?? intl.formatMessage(messages.stay)}
        </Button>,
      ]}
    >
      <span>{customDescription || intl.formatMessage(messages.discardedInputsWarning)} </span>
    </Modal>
  );
};

WarningModal.propTypes = {
  type: PropTypes.string,
  customTitle: PropTypes.node,
  customDescription: PropTypes.node,
  customPrimaryButtonTitle: PropTypes.string,
  customSecondaryButtonTitle: PropTypes.string,
  isOpen: PropTypes.bool,
  onModalCancel: PropTypes.func,
  onModalConfirm: PropTypes.func,
};
