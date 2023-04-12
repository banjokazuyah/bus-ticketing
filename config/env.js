export const env = {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
    PORT: process.env.PORT || 3000,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/busticketing",
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || "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",
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || "thisismynewcourse",
    EMAIL_ADDRESS_OWNER: process.env.EMAIL_ADDRESS_OWNER,
    EMAIL_ADDRESS_PW: process.env.EMAIL_ADDRESS_PW,

};