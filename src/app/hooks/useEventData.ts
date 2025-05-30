import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '../components/events/types';

export function useEventData() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:8080/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      setError('Cannot connect to the server. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return { events, isLoading, error, fetchEvents };
} 