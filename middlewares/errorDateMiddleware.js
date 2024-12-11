const logger = (req,res,next) => {
    const start = new Date().toString();
    console.error(`[${start}] | ${req.method} | ${req.url}`);
    next();
}

module.exports = logger;