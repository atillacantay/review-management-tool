import { transformLocalizedStringToLocalizedField } from '@commercetools-frontend/l10n';

export const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

export const extractErrorFromGraphQlResponse = (graphQlResponse) => {
  if (graphQlResponse.networkError?.result?.errors?.length > 0) {
    return graphQlResponse.networkError.result.errors;
  }

  if (graphQlResponse.graphQLErrors?.length > 0) {
    return graphQlResponse.graphQLErrors;
  }

  return graphQlResponse;
};

const getNameFromPayload = (payload) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

const convertAction = (actionName, actionPayload) => ({
  [actionName]:
    actionName === 'changeName'
      ? getNameFromPayload(actionPayload)
      : actionPayload,
});

export const createGraphQlUpdateActions = (actions) =>
  actions.reduce(
    (previousActions, { action: actionName, ...actionPayload }) => [
      ...previousActions,
      convertAction(actionName, actionPayload),
    ],
    []
  );

export const convertToActionData = (draft) => ({
  ...draft,
});

export const getCustom = (custom, fieldName) =>
  custom?.customFieldsRaw?.find(({ name }) => name === fieldName)?.value;

export const getStoreKey = (review) => getCustom(review.custom, 'storeKey');

export const getShop = (review) => getStoreKey(review); // getStoreKey(review)?.split('-')[0];

export const getCountry = (review) => getStoreKey(review)?.split('-')[1];

export const getLanguage = (review) => review?.locale;

export const getSku = (review) => getCustom(review.custom, 'sku');

export const visibilityKeys = {
  initial: 'review_initial_state',
  visible: 'review_visible_state',
  invisible: 'review_invisible_state',
};

export const getStateKey = (review) => review.state?.key;

export const getState = (review) => ({
  key: getStateKey(review),
  typeId: 'state',
});

export const visibleStates = [visibilityKeys.initial, visibilityKeys.visible];

export const inVisibleStates = [visibilityKeys.invisible];

export const getVisibility = (review) =>
  visibleStates.includes(getStateKey(review)) || false;

export const normalize = (review) => ({
  id: review.id,
  key: review.id,
  version: review.version,
  shop: getShop(review),
  country: getCountry(review),
  language: getLanguage(review),
  authorName: review.authorName,
  createdAt: review.createdAt,
  text: review.text,
  rating: review.rating,
  sku: getSku(review),
  isVisible: getVisibility(review),
  state: getState(review),
});

export const formValuesToDoc = (formValues) => ({
  id: formValues.id,
  version: formValues.version,
  state: formValues.state,
});

export const normalizeReviewsData = (data) =>
  data?.reviews?.results?.map((review) => normalize(review));

export const filterColumns = (columns, keys) =>
  columns?.filter((column) => !keys.includes(column));

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getToday = () => new Date();

export const getOneMonthBefore = () =>
  new Date(new Date().setDate(getToday().getDate() - 30));

export const dateFormatter = (date) => date;

export const buildReviewsWhere = (filters, storeKeys, countries) => {
  const predicates = [];

  if (filters.shop.length && filters.country.length) {
    const countryWithShop = [];
    if (filters.shop.length >= filters.country.length) {
      filters.shop.forEach((shop) => {
        filters.country.forEach((country) => {
          countryWithShop.push(`${shop}-${country}`);
        });
      });
    } else {
      filters.country.forEach((country) => {
        filters.shop.forEach((shop) => {
          countryWithShop.push(`${shop}-${country}`);
        });
      });
    }

    predicates.push(
      `custom(fields(storeKey in ("${countryWithShop.join('","')}")))`
    );
  } else if (filters.country.length && countries) {
    const countryWithShop = [];
    filters.country.forEach((country) => {
      countryWithShop.push(...countries[country]);
    });

    predicates.push(
      `custom(fields(storeKey in ("${countryWithShop.join('","')}")))`
    );
  } else if (filters.shop.length && storeKeys) {
    const shopWithCountry = [];
    filters.shop.forEach((shop) => {
      if (storeKeys[shop]) {
        storeKeys[shop].forEach((key) => {
          shopWithCountry.push(`${shop}-${key}`);
        });
      }
    });

    predicates.push(
      `custom(fields(storeKey in ("${shopWithCountry.join('","')}")))`
    );
  }

  if (filters.language.length) {
    predicates.push(`locale in ("${filters.language.join('","')}")`);
  }

  if (filters.ratingFrom && filters.ratingTo) {
    predicates.push(
      `rating >= ${filters.ratingFrom} and rating <= ${filters.ratingTo}`
    );
  }

  if (filters.date.length) {
    predicates.push(
      `createdAt >= "${dateFormatter(
        filters.date[0]
      )}" and createdAt <= "${dateFormatter(filters.date[1])}"`
    );
  }

  if (filters.state.length) {
    predicates.push(`state(id in ("${filters.state.join('","')}"))`);
  }

  if (filters.sku.length) {
    predicates.push(
      `custom(fields(sku in ("${filters.sku
        .map(({ value }) => value)
        .join('","')}")))`
    );
  }

  return predicates.join(' and ') || null;
};
