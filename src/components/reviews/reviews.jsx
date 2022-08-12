import {
  Switch,
  useHistory,
  useRouteMatch,
  useLocation,
} from 'react-router-dom';
import {
  buildReviewsWhere,
  capitalizeFirstLetter,
  getErrorMessage,
  getOneMonthBefore,
  getToday,
  visibilityKeys,
} from '../../helpers';
import {
  useDataTableSortingState,
  usePaginationState,
} from '@commercetools-uikit/hooks';
import {
  useReviewStateUpdater,
  useReviewsFetcher,
  useStoresFetcher,
} from '../../hooks/use-reviews-connector';

import Constraints from '@commercetools-uikit/constraints';
import { ContentNotification } from '@commercetools-uikit/notifications';
import DataTable from '@commercetools-uikit/data-table';
import { EyeIcon } from '@commercetools-uikit/icons';
import IconButton from '@commercetools-uikit/icon-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import PropTypes from 'prop-types';
import ReviewDetails from '../review-details/review-details';
import Spacings from '@commercetools-uikit/spacings';
import SelectField from '@commercetools-uikit/select-field';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import NumberField from '@commercetools-uikit/number-field';
import CreatableSelectField from '@commercetools-uikit/creatable-select-field';
import DateRangeField from '@commercetools-uikit/date-range-field';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import Text from '@commercetools-uikit/text';
import ToggleInput from '@commercetools-uikit/toggle-input';
import messages from './messages';
import reviewMessages from '../review-details/messages';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useSearchParams } from '../../hooks/useSearchParams';
import { useStatesFetcher } from '../../hooks/use-reviews-connector/use-reviews-connector';

const columns = [
  { key: 'shop', label: 'Shop', isSortable: true },
  { key: 'country', label: 'Country', isSortable: true },
  { key: 'language', label: 'Language', isSortable: true },
  { key: 'authorName', label: 'User', isSortable: true },
  { key: 'createdAt', label: 'Date', isSortable: true },
  { key: 'text', label: 'Review', isSortable: true, isTruncated: true },
  { key: 'rating', label: 'Rating', isSortable: true },
  { key: 'actions', label: 'Actions', isSortable: false },
];

const WrapWith = (props) =>
  props.condition ? props.wrapper(props.children) : props.children;
WrapWith.displayName = 'WrapWith';
WrapWith.propTypes = {
  condition: PropTypes.bool.isRequired,
  wrapper: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const generateDropdownOption = ({ value, label }) => ({
  value,
  label,
});

const CONSTANTS = {
  shop: [],
  language: [],
  country: [],
  sku: [],
  date: [getOneMonthBefore().toISOString(), getToday().toISOString()],
  ratingFrom: '0',
  ratingTo: '5',
  state: [],
};

const Reviews = () => {
  const { projectLanguages } = useApplicationContext((context) => ({
    projectLanguages: context.project.languages,
  }));
  const match = useRouteMatch();
  const { push, goBack } = useHistory();
  const intl = useIntl();
  const { search, query } = useLocation();
  const { page, perPage } = usePaginationState();
  const [queryParams, setQueryParams] = useSearchParams(query);
  const { storeKeys, countries } = useStoresFetcher();
  const { states } = useStatesFetcher({
    where: 'type = "ReviewState"',
  });

  const defaultFilters = {
    shop: query?.shop?.split(',') || CONSTANTS.shop,
    language: query?.language?.split(',') || CONSTANTS.language,
    country: query?.country?.split(',') || CONSTANTS.country,
    sku:
      query?.sku
        ?.toString()
        .split(',')
        ?.map((sku) => generateDropdownOption({ value: sku, label: sku })) ||
      CONSTANTS.sku,
    date: query?.date?.split(',') || CONSTANTS.date,
    ratingFrom: query?.ratingFrom || CONSTANTS.ratingFrom,
    ratingTo: query?.ratingTo || CONSTANTS.ratingTo,
    state: query?.state?.split(',') || CONSTANTS.state,
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [newFilters, setNewFilters] = useState(filters);
  const [dropdowns, setDropdowns] = useState({
    shop: [],
    language: projectLanguages.map((lang) =>
      generateDropdownOption({ value: lang, label: lang })
    ),
    country: [],
    state: [],
  });

  const tableSorting = useDataTableSortingState({
    key: 'authorName',
    order: 'asc',
  });
  const { reviews, error, loading } = useReviewsFetcher({
    where: buildReviewsWhere(filters, storeKeys, countries),
    page,
    perPage,
    tableSorting,
  });
  const { execute, loading: loadingUpdate } = useReviewStateUpdater();

  useEffect(() => {
    if (storeKeys && countries) {
      setDropdowns({
        ...dropdowns,
        shop: Object.keys(storeKeys)?.map((storeKey) =>
          generateDropdownOption({
            value: storeKey,
            label: storeKey,
          })
        ),
        country: Object.keys(countries)?.map((country) =>
          generateDropdownOption({
            value: country,
            label: country,
          })
        ),
        state: states?.map((state) =>
          generateDropdownOption({
            value: state.id,
            label: intl.formatMessage(messages[state.key]),
          })
        ),
      });
    }
  }, [
    storeKeys && Object.keys(storeKeys).length,
    countries && Object.keys(countries).length,
    states?.length,
  ]);

  useEffect(() => {
    if (search) {
      setFilters(newFilters);
    } else {
      setFilters(defaultFilters);
      setNewFilters(defaultFilters);
    }
  }, [search]);

  const onSave = () => push({ search: queryParams.toString() });

  const clearFilters = () => {
    setQueryParams();
  };

  const onChange = (name, value) => {
    setNewFilters({
      ...newFilters,
      [name]: value,
    });

    if (
      Array.isArray(value) &&
      value.some((item) => typeof item === 'object')
    ) {
      value = value.map(({ value }) => value);
    }

    queryParams.set(name, value);
    if (!queryParams.get(name)) {
      queryParams.delete(name);
    }
  };

  const onSortChange = (columnKey, sortDirection) => {
    switch (columnKey) {
      case 'shop':
        columnKey = 'custom.fields.storeKey';
        break;
      case 'language':
        columnKey = 'locale';
        break;
      default:
        break;
    }

    tableSorting.onChange(columnKey, sortDirection);
  };

  const onVisibilityChange = async (originalDraft) => {
    const nextDraft = {
      ...originalDraft,
      state: {
        ...originalDraft.state,
        key: !originalDraft.state.key
          ? visibilityKeys.initial
          : [visibilityKeys.initial, visibilityKeys.visible].includes(
              originalDraft.state.key
            )
          ? visibilityKeys.invisible
          : visibilityKeys.visible,
      },
    };
    await execute({ originalDraft, nextDraft });
  };

  const redirectToDetailsPage = (id) => push(`${match.url}/${id}`);

  const ignorableDataCells = ['actions'];
  const itemRenderer = (item, column) => {
    if (!ignorableDataCells.includes(column.key) && !item[column.key])
      return Number.NaN.toString();
    switch (column.key) {
      case 'shop':
        return capitalizeFirstLetter(String(item.shop));
      case 'country':
        return String(item.country).toUpperCase();
      case 'createdAt':
        return new Date(item.createdAt).toLocaleDateString();
      case 'actions':
        return (
          <Spacings.Inline alignItems="center">
            <ToggleInput
              name="isVisible"
              isChecked={item.isVisible}
              value={item.state.key}
              onChange={() => onVisibilityChange(item)}
              horizontalConstraint={13}
              size="small"
              isDisabled={loadingUpdate}
            />
            <IconButton
              icon={<EyeIcon />}
              label=""
              onClick={() => redirectToDetailsPage(item.id)}
            />
          </Spacings.Inline>
        );
      default:
        return item[column.key];
    }
  };

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Constraints.Horizontal>
      <Spacings.Stack scale="xl">
        <Text.Headline as="h1" intlMessage={messages.title} />
        <Spacings.Stack scale="xl">
          <Spacings.Stack scale="l">
            <Text.Headline as="h1" intlMessage={messages.filters} />
            <Spacings.Inline alignItems="center" justifyContent="space-between">
              <SelectField
                title={intl.formatMessage(reviewMessages.reviewShopLabel)}
                isMulti
                options={dropdowns.shop}
                value={newFilters.shop}
                onChange={(event) => onChange('shop', event.target.value)}
              />
              <SelectField
                title={intl.formatMessage(reviewMessages.reviewLanguageLabel)}
                isMulti
                options={dropdowns.language}
                value={newFilters.language}
                onChange={(event) => onChange('language', event.target.value)}
              />
              <CreatableSelectField
                title={intl.formatMessage(reviewMessages.reviewSkuLabel)}
                placeholder={intl.formatMessage(
                  reviewMessages.reviewSkuPlaceholder
                )}
                isMulti
                value={newFilters.sku}
                onChange={(event) => onChange('sku', event.target.value)}
              />
            </Spacings.Inline>
            <Spacings.Inline>
              <SelectField
                title={intl.formatMessage(reviewMessages.reviewCountryLabel)}
                isMulti
                options={dropdowns.country}
                value={newFilters.country}
                onChange={(event) => onChange('country', event.target.value)}
              />
              <DateRangeField
                title={intl.formatMessage(reviewMessages.reviewDateLabel)}
                value={newFilters.date}
                onChange={(event) => onChange('date', event.target.value)}
              />
            </Spacings.Inline>
            <Spacings.Inline>
              <SelectField
                title={intl.formatMessage(reviewMessages.reviewVisibilityLabel)}
                isMulti
                options={dropdowns.state}
                value={newFilters.state}
                onChange={(event) => onChange('state', event.target.value)}
              />
              <NumberField
                title={intl.formatMessage(reviewMessages.reviewRatingFromLabel)}
                value={newFilters.ratingFrom}
                onChange={(event) => onChange('ratingFrom', event.target.value)}
                horizontalConstraint={4}
                min={0}
                max={5}
              />
              <NumberField
                title={intl.formatMessage(reviewMessages.reviewRatingToLabel)}
                value={newFilters.ratingTo}
                onChange={(event) => onChange('ratingTo', event.target.value)}
                horizontalConstraint={4}
                min={0}
                max={5}
              />
            </Spacings.Inline>
          </Spacings.Stack>
          <Spacings.Inline justifyContent="flex-end">
            <PrimaryButton
              label={intl.formatMessage(messages.apply)}
              onClick={onSave}
            />
            <SecondaryButton
              label={intl.formatMessage(messages.clearFilters)}
              onClick={clearFilters}
            />
          </Spacings.Inline>
        </Spacings.Stack>
        <Spacings.Stack scale="l">
          <Text.Headline as="h1" intlMessage={messages.reviews} />
          {loading && <LoadingSpinner scale="l" />}
          {reviews && (
            <DataTable
              isCondensed
              columns={columns}
              rows={reviews}
              maxHeight={600}
              sortedBy={tableSorting.value.key}
              sortDirection={tableSorting.value.order}
              onSortChange={onSortChange}
              itemRenderer={itemRenderer}
            />
          )}
          <Switch>
            <SuspendedRoute path={`${match.path}/:id`}>
              <ReviewDetails onClose={() => goBack()} />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};
Reviews.displayName = 'Reviews';

export default Reviews;
