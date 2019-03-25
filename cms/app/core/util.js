const primitives = {
    "string" : "TEXT",
    "number" : "REAL",
    "boolean" : "INTEGER"
};

module.exports = {
    primitives: primitives,
    isPrimitive: (field) => {
        return !!primitives[field];
    }
}