const { isWebUri } = require("valid-url");
const logger = require("../logger");

const NO_ERRORS = null;

function getProgressValidationError({ url }) {
  if (url && !isWebUri(url)) {
    logger.error(`Invalid url '${url}' supplied`);
    return {
      error: {
        message: `'url' must be a valid URL`,
      },
    };
  }

  return NO_ERRORS;
}

module.exports = {
  getProgressValidationError,
};
