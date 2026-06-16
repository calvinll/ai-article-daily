export const logger = {
  info(message: string, extra?: Record<string, unknown>) {
    console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), message, ...extra }));
  },
  error(message: string, extra?: Record<string, unknown>) {
    console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), message, ...extra }));
  },
};
