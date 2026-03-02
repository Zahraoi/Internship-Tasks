import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const bookService = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  search: (q) => api.get(`/books/search?q=${q}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  delete: (id) => api.delete(`/books/${id}`)
};

export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  search: (q) => api.get(`/members/search?q=${q}`),
  create: (member) => api.post('/members', member),
  update: (id, member) => api.put(`/members/${id}`, member),
  delete: (id) => api.delete(`/members/${id}`)
};

export const issueService = {
  getAll: () => api.get('/issues'),
  getByMember: (memberId) => api.get(`/issues/member/${memberId}`),
  issue: (data) => api.post('/issues', data),
  return: (id) => api.put(`/issues/return/${id}`)
};

export default api;
