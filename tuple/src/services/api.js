import axios from 'axios';
import { API_ENDPOINTS, APP_CONFIG } from '../constants/config';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.baseURL,
  timeout: APP_CONFIG.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 여기서 토큰 등을 추가할 수 있습니다
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;

