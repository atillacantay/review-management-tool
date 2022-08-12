import { visibilityKeys, visibleStates } from '../../helpers';

import DateField from '@commercetools-uikit/date-field';
import FieldLabel from '@commercetools-uikit/field-label';
import PropTypes from 'prop-types';
import Spacings from '@commercetools-uikit/spacings';
import TextField from '@commercetools-uikit/text-field';
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import ToggleInput from '@commercetools-uikit/toggle-input';
import messages from './messages';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import validate from './validate';

const ReviewDetailsForm = (props) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });

  const onVisibilityChange = async (event) => {
    const newVisibility = {
      ...formik.values.state,
      key: [visibilityKeys.initial, visibilityKeys.visible].includes(
        formik.values.state.key
      )
        ? visibilityKeys.invisible
        : visibilityKeys.visible,
    };

    formik.setFieldValue('state', newVisibility);
    formik.setFieldValue(
      'isVisible',
      visibleStates.includes(newVisibility.key)
    );
  };

  const formElements = (
    <Spacings.Stack scale="l">
      <Spacings.Inline>
        <TextField
          name="shop"
          title={intl.formatMessage(messages.reviewShopLabel)}
          value={formik.values.shop}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
        <TextField
          name="language"
          title={intl.formatMessage(messages.reviewLanguageLabel)}
          value={formik.values.language}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
        <TextField
          name="sku"
          title={intl.formatMessage(messages.reviewSkuLabel)}
          value={formik.values.sku}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
      </Spacings.Inline>
      <Spacings.Inline>
        <TextField
          name="country"
          title={intl.formatMessage(messages.reviewCountryLabel)}
          value={formik.values.country}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
        <DateField
          name="createdAt"
          title={intl.formatMessage(messages.reviewDateLabel)}
          value={formik.values.createdAt}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
      </Spacings.Inline>
      <Spacings.Inline>
        <Spacings.Stack>
          <FieldLabel
            title={intl.formatMessage(messages.reviewVisibilityLabel)}
          />
          <ToggleInput
            name="isVisible"
            isChecked={formik.values.isVisible}
            value={formik.values.state.key}
            onChange={onVisibilityChange}
            horizontalConstraint={13}
            size="small"
          />
        </Spacings.Stack>
        <TextField
          name="rating"
          title={intl.formatMessage(messages.reviewRatingLabel)}
          value={formik.values.rating?.toString()}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
        <TextField
          name="authorName"
          title={intl.formatMessage(messages.reviewAuthorNameLabel)}
          value={formik.values.authorName}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
      </Spacings.Inline>
      <Spacings.Inline>
        <MultilineTextField
          name="text"
          title={intl.formatMessage(messages.reviewTextLabel)}
          value={formik.values.text}
          isReadOnly={true}
          isDisabled
          horizontalConstraint={13}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );

  return props.children({
    formElements,
    values: formik.values,
    isDirty: formik.dirty,
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};
ReviewDetailsForm.displayName = 'ReviewDetailsForm';
ReviewDetailsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  dataLocale: PropTypes.string.isRequired,
};

export default ReviewDetailsForm;
