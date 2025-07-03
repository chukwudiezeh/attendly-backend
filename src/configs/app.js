const config = {
  app: {
    env: process.env.APPLICATION_ENV || 'development',
    port: process.env.PORT || 9000,
  },

  database: {
    mongoUrl: process.env.MONGO_DB_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'Attendly',
    expiresIn: process.env.JWT_EXPIRES_IN || '604800', // in seconds (7 days)
  },

  mail: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    from: process.env.MAIL_FROM || 'Attendly <no-reply@attendly.ng>',
  },
};

module.exports = config;
