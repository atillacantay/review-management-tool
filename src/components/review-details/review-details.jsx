import {
  FormModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { formValuesToDoc } from '../../helpers';
import {
  useReviewDetailsFetcher,
  useReviewDetailsUpdater,
} from '../../hooks/use-reviews-connector';
import {
  useShowApiErrorNotification,
  useShowNotification,
} from '@commercetools-frontend/actions-global';

import { ContentNotification } from '@commercetools-uikit/notifications';
import { DOMAINS } from '@commercetools-frontend/constants';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { PERMISSIONS } from '../../constants';
import PropTypes from 'prop-types';
import ReviewDetailsForm from './review-details-form';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { transformErrors } from './transform-errors';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import { useParams } from 'react-router-dom';

const ReviewDetails = (props) => {
  const intl = useIntl();
  const params = useParams();
  const { loading, error, review } = useReviewDetailsFetcher(params.id);
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const ReviewDetailsUpdater = useReviewDetailsUpdater();
  const handleSubmit = useCallback(
    async (formikValues, formikHelpers) => {
      const data = formValuesToDoc(formikValues);
      try {
        await ReviewDetailsUpdater.execute({
          originalDraft: review,
          nextDraft: data,
        });
        showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.reviewUpdated),
        });
      } catch (graphQLErrors) {
        const transformedErrors = transformErrors(graphQLErrors);
        if (transformedErrors.unmappedErrors.length > 0) {
          showApiErrorNotification({
            errors: transformedErrors.unmappedErrors,
          });
        }

        formikHelpers.setErrors(transformedErrors.formErrors);
      }
    },
    [
      review,
      ReviewDetailsUpdater,
      intl,
      showApiErrorNotification,
      showNotification,
    ]
  );

  if (!review) return '';

  return (
    <ReviewDetailsForm
      initialValues={review}
      onSubmit={handleSubmit}
      isReadOnly={!canManage}
      dataLocale={dataLocale}
    >
      {(formProps) => {
        return (
          <FormModalPage
            title={formProps.values?.id}
            isOpen
            onClose={props.onClose}
            isPrimaryButtonDisabled={
              formProps.isSubmitting || !formProps.isDirty || !canManage
            }
            isSecondaryButtonDisabled={!formProps.isDirty}
            onSecondaryButtonClick={formProps.handleReset}
            onPrimaryButtonClick={formProps.submitForm}
            labelPrimaryButton={FormModalPage.Intl.save}
            labelSecondaryButton={FormModalPage.Intl.revert}
          >
            {loading && (
              <Spacings.Stack alignItems="center">
                <LoadingSpinner />
              </Spacings.Stack>
            )}
            {error && (
              <ContentNotification type="error">
                <Text.Body>
                  {intl.formatMessage(messages.reviewDetailsErrorMessage)}
                </Text.Body>
              </ContentNotification>
            )}
            {review && formProps.formElements}
            {review === null && <PageNotFound />}
          </FormModalPage>
        );
      }}
    </ReviewDetailsForm>
  );
};
ReviewDetails.displayName = 'ReviewDetails';
ReviewDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ReviewDetails;
