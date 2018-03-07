var envVars = {
    backboneUrl: process.env.BACKBONE_URL || "http://iot.gongyuanhezi.cn",
    apiToken: process.env.API_TOKEN,
    debug: process.env.DEBUG || true
};

// You would change the contents of the various envs as you would like
module.exports = {
    development: {
        ENV_VARS: envVars
    },
    staging: {
        ENV_VARS: envVars
    },
    production: {
        ENV_VARS: envVars
    }
};
