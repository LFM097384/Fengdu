
const ENV = {
    local: {
      frontend: 'http://localhost:3000',
      backend: 'http://localhost:8000'
    },
    production: {
      frontend: 'http://fengdu.social',
      backend: 'http://api.fengdu.social'
    }
  };
  
  export const API_BASE_URL = process.env.REACT_APP_API_URL || ENV[process.env.REACT_APP_ENV || 'local'].backend;