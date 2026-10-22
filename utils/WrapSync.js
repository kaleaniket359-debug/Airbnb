module.exports = (fn) => {
    if (typeof fn !== "function") {
        throw new TypeError(`WrapSync expected a function, received: ${typeof fn}`);
    }

    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};