/* eslint-disable no-param-reassign */
module.exports = (config, isProduction, buildTarget = 'runtime') => {
  config.plugins.forEach((plugin) => {
    if (plugin?.runtimeOptions?.linkType === 'text/css') {
      plugin.options = {
        ...plugin.options,
        filename: isProduction
          ? buildTarget === 'editor'
            ? '../../view/adminhtml/web/css/editor.css'
            : '../../view/frontend/web/css/styles.css'
          : 'static/css/styles.css',
        hunkFilename: isProduction
          ? '../../view/frontend/web/css/[name].chunk.css'
          : 'static/css/[name].chunk.js',
      };
    }
  });
};
