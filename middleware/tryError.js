module.exports.tryError = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}