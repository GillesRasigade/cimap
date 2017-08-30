export default {
  port: process.env.PORT || 3000,
  exitTimeout: parseInt(process.env.EXIT_TIMEOUT || '3000', 10) // Milliseconds
};
