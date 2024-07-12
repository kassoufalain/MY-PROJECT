// pages/api/notes.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000'; // Your backend URL

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  const token = req.headers.authorization || '';

  switch (method) {
    case 'GET':
      try {
        const response = await axios.get(`${BACKEND_URL}/api/notes`, {
          headers: { Authorization: token }
        });
        res.status(200).json(response.data);
      } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
      }
      break;

    case 'POST':
      try {
        const response = await axios.post(`${BACKEND_URL}/api/notes`, req.body, {
          headers: { Authorization: token }
        });
        res.status(201).json(response.data);
      } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        const response = await axios.delete(`${BACKEND_URL}/api/notes/${id}`, {
          headers: { Authorization: token }
        });
        res.status(200).json(response.data);
      } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const response = await axios.put(`${BACKEND_URL}/api/notes/${id}`, req.body, {
          headers: { Authorization: token }
        });
        res.status(200).json(response.data);
      } catch (error: any) {
        res.status(error.response?.status || 500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
