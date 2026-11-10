export interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventRecord {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  location: string;
  organizer: {
    _id: string;
    fullName: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  location: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
