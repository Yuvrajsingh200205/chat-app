import pg from "pg";

const pool = new pg.Pool({  // Mistake was here, should use `pg.Pool` instead of just `pg`
    user: "postgres",
    host: "localhost",
    database: "user",
    password: "yuvraj@2002",
    port: 5432,
});

pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
    console.error('Details:', err.stack);
  });

export default pool;  // Since you're using ES modules, use `export default` instead of `module.exports`
