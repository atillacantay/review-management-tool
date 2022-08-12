import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Reviews',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'bbg-dev',
    },
    production: {
      applicationId: 'cl6qb6d6v163295001w3cgndhils',
      url: 'https://fantastic-empanada-3fbb7f.netlify.app',
    },
  },

  oAuthScopes: {
    view: ['view_products', 'view_states'],
    manage: ['manage_products'],
  },

  icon: '${path:@commercetools-frontend/assets/application-icons/chat.svg}',
  mainMenuLink: {
    defaultLabel: 'Reviews',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;
