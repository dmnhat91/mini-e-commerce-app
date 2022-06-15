// this file is loaded up automatically whenever NextJS starts up
module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
};