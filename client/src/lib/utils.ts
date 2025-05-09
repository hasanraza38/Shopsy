import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true
});

