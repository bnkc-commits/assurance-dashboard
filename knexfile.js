module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // Render fournit DATABASE_URL automatiquement
    migrations: {
      directory: './migrations'
    }
  }
};
