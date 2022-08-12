import {
  convertToActionData,
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
  normalize,
  normalizeReviewsData,
} from '../../helpers';
import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';

import FetchReviewDetailsQuery from './fetch-review-details.ctp.graphql';
import FetchReviewsQuery from './fetch-reviews.ctp.graphql';
import FetchStoresQuery from './fetch-stores.ctp.graphql';
import FetchStatesQuery from './fetch-states.ctp.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import UpdateReviewDetailsMutation from './update-review-details.ctp.graphql';
import { createSyncReviews } from '../../sync-actions';

export const useStoresFetcher = () => {
  const { data, error, loading } = useMcQuery(FetchStoresQuery, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const stores = data?.stores?.results?.map(({ key }) => key);

  const storeKeys = stores?.reduce((store, word) => {
    const brand = word.split('-')[0];
    const country = word.split('-')[1];
    const keyStore = store[brand] || (store[brand] = []);
    keyStore.push(country);

    return store;
  }, {});

  const countries = stores?.reduce((store, word) => {
    const letter = word.split('-')[1];
    const keyStore = store[letter] || (store[letter] = []);
    keyStore.push(word);

    return store;
  }, {});

  return {
    stores: data?.stores?.results,
    storeKeys,
    countries,
    error,
    loading,
  };
};

export const useStatesFetcher = ({ where }) => {
  const { data, error, loading } = useMcQuery(FetchStatesQuery, {
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    variables: {
      where,
    },
  });

  return {
    states: data?.states?.results,
    error,
    loading,
  };
};

export const useReviewsFetcher = ({
  skip,
  where,
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery(FetchReviewsQuery, {
    skip,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    variables: {
      where,
      limit: 500, //perPage.value
      // offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
  });

  const normalizedData = normalizeReviewsData(data);

  return {
    reviews: normalizedData,
    error,
    loading,
  };
};

export const useReviewDetailsFetcher = (reviewId) => {
  const { data, error, loading } = useMcQuery(FetchReviewDetailsQuery, {
    variables: {
      reviewId,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  let normalizedReview = data?.review;
  if (data?.review) {
    normalizedReview = normalize(data?.review);
  }

  return {
    review: normalizedReview,
    error,
    loading,
  };
};

export const useReviewStateUpdater = () => {
  const [updateReviewState, { loading }] = useMcMutation(
    UpdateReviewDetailsMutation
  );

  const execute = async ({ originalDraft, nextDraft }) => {
    try {
      return await updateReviewState({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          reviewId: originalDraft.id,
          version: originalDraft.version,
          actions: {
            transitionState: {
              state: {
                typeId: 'state',
                key: nextDraft.state.key,
              },
            },
          },
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    execute,
    loading,
  };
};

export const useReviewDetailsUpdater = () => {
  const [updateReviewDetails, { loading }] = useMcMutation(
    UpdateReviewDetailsMutation
  );

  const syncReviews = createSyncReviews();
  const execute = async ({ originalDraft, nextDraft }) => {
    const actions = syncReviews.buildActions(
      nextDraft,
      convertToActionData(originalDraft)
    );
    try {
      return await updateReviewDetails({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          reviewId: originalDraft.id,
          version: originalDraft.version,
          actions: createGraphQlUpdateActions(actions),
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
