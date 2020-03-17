/* Environment */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/* SEED authentication */
process.env.SEED = process.env.SEED || process.env.SEED_LOCAL

/* Database */
let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = process.env.MONGO_URI_LOCAL
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB

/* Google client ID */
process.env.GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID_LOCAL
