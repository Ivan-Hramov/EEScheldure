const activeRoutes = new Map();
const STEPS = {
    WAIT_FOR_FROM: 0,
    WAIT_FOR_TO: 1,
    WAIT_FOR_RESULT: 2
};

module.exports = {
    activeRoutes,
    STEPS
};