import { IConfig, IConfigSchema } from './config.interfaces';

// This schema is global to all Foal packages.
export const settingsConfigSchema = {
  /* Common to multiple packages */
  debug: { type: 'boolean' },
  logErrors: { type: 'boolean' },

  /* @foal/aws-s3 */
  aws: {
    endpoint: { type: 'string' },
    accessKeyId: { type: 'string' },
    secretAccessKey: { type: 'string' },
    region: { type: 'string' },
  },

  /* @foal/core */
  logger: {
    format: { type: 'string' }, // 'dev'|'raw'|'json'|'none'
    logLevel: { type: 'string' }, // 'debug'|'info'|'warn'|'error'
  },
  templateEngine: { type: 'string' },
  ajv: {
    $data: { type: 'boolean' },
    allErrors: { type: 'boolean' },
    coerceTypes: { type: 'boolean|string' }, // boolean | 'array'
    removeAdditional: { type: 'boolean|string' }, // boolean | 'all' | 'failing'
    useDefaults: { type: 'boolean|string' }, // boolean | 'empty'
  },
  openapi: {
    useHooks: { type: 'boolean' },
  },
  staticPathPrefix: { type: 'string' },
  staticPath: { type: 'string' },
  bodyParser: {
    limit: { type: 'number|string' },
  },
  cookieParser: {
    secret: { type: 'string' },
  },
  session: {
    store: { type: 'string', required: true },
    cookie: {
      name: { type: 'string' },
      sameSite: { type: 'string' }, // 'strict'|'lax'|'none'
      domain: { type: 'string' },
      path: { type: 'string' },
      secure: { type: 'boolean' },
      httpOnly: { type: 'boolean' },
    },
    csrf: {
      enabled: { type: 'boolean' },
      cookie: {
        name: { type: 'string' },
      }
    }
  },

  /* @foal/jwt */
  jwt: {
    secret: { type: 'string' },
    secretEncoding: { type: 'string' },
    publicKey: { type: 'string' },
    privateKey: { type: 'string' },
    cookie: {
      name: { type: 'string' },
      sameSite: { type: 'string' }, // 'strict'|'lax'|'none'
      domain: { type: 'string' },
      path: { type: 'string' },
      secure: { type: 'boolean' },
      httpOnly: { type: 'boolean' },
    },
    csrf: {
      enabled: { type: 'boolean' },
      cookie: {
        name: { type: 'string' },
      }
    }
  },

  /* @foal/mongodb */
  mongodb: {
    uri: { type: 'string', required: true },
  },

  /* @foal/redis */
  redis: {
    uri: { type: 'string' },
  },

  /* @foal/social */
  social: {
    secret: {
      codeVerifierSecret: { type: 'string', required: true },
    },
    facebook: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      redirectUri: { type: 'string', required: true },
    },
    github: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      redirectUri: { type: 'string', required: true },
    },
    google: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      redirectUri: { type: 'string', required: true },
    },
    linkedin: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      redirectUri: { type: 'string', required: true },
    },
    twitter: {
      clientId: { type: 'string', required: true },
      clientSecret: { type: 'string', required: true },
      redirectUri: { type: 'string', required: true },
    },
    cookie: {
      domain: { type: 'string' },
      secure: { type: 'boolean' },
    }
  },

  /* @foal/storage */
  disk: {
    driver: { type: 'string' },
    local: {
      directory: { type: 'string', required: true },
    },
    /* @foal/aws-s3 */
    s3: {
      bucket: { type: 'string', required: true },
      serverSideEncryption: { type: 'string' },
    }
  },
  multipartRequests: {
    fileNumberLimit: { type: 'number' },
    fileSizeLimit: { type: 'number' },
  },
} satisfies IConfigSchema;

export type ISettingsConfig = IConfig<typeof settingsConfigSchema>;
