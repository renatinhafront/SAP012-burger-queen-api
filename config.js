exports.port = process.argv[2] || process.env.PORT || 8080;
exports.dbUrl = process.env.MONGO_URL || process.env.DB_URL || 'mongodb+srv://resaraiva09:QUpDRFY4lvFYszmz@cluster0.eroqsb1.mongodb.net/burger-queen?retryWrites=true&w=majority&appName=Cluster0';
exports.secret = process.env.JWT_SECRET || 'esta-es-la-api-burger-queen';
exports.adminEmail = process.env.ADMIN_EMAIL || 'admin@localhost.com';
exports.adminPassword = process.env.ADMIN_PASSWORD || 'changeme';
