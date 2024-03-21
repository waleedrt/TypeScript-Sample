import Constants from 'expo-constants';

/**
 * Determine the environment for the application.
 *
 * @param {string} releaseChannel The Expo release channel.
 */
function environmentChecker(releaseChannel) {
  if (
    typeof releaseChannel === 'string' &&
    releaseChannel.startsWith('production')
  ) {
    return 'production';
  }
  return 'development';
}

const overrideEnvironment = {
  environment: environmentChecker(Constants.manifest.releaseChannel),
};

const environment = {
  development: {
    isProduction: false,
    environment: 'development',
    // The base url of your testing api server. 
    apiUrl: 'https://example-qa.apu.edu/',
    // Your development OAuth application client ID from Django
    clientID: '',

    sentry: {
      dsn:
        'your sentry DSN',
    },

    persist: {
      version: 7,
    },
  },
  production: {
    isProduction: true,
    environment: 'production',
    // The base url of your production api server. 
    apiUrl: 'https://example.apu.edu/',
    // Your production OAuth application client ID from Django
    clientID: '',

    sentry: {
      dsn:
        'your sentry DSN',
    },

    persist: {
      version: 7,
    },
  },
}[overrideEnvironment.environment || 'production'];

export default {
  ...environment,
  ...overrideEnvironment,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  app: {
    name: 'WorkWell',
    description:
      'A platform that helps people to take the small steps needed to flourish, at work and in life.',
  },
};
