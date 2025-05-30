import { useRouter } from 'next/navigation';
import { Event, EventFormData } from '../components/events/types';

export function useEventHandlers(fetchEvents: () => Promise<void>) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent, formData: EventFormData, editingEvent: Event | null): Promise<string | null> => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return null;
    }

    if (!formData.name || !formData.description || !formData.date || 
        !formData.address.name || !formData.address.city || !formData.address.street || !formData.address.postCode ||
        !formData.availableTickets || !formData.ticketPrice) {
      return 'All fields are required';
    }

    const availableTickets = parseInt(formData.availableTickets);
    const ticketPrice = parseFloat(formData.ticketPrice);

    if (isNaN(availableTickets) || isNaN(ticketPrice)) {
      return 'Invalid numeric values';
    }

    const eventData = {
      id: editingEvent?.id,
      name: formData.name,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      address: {
        id: editingEvent?.address?.id,
        name: formData.address.name,
        city: formData.address.city,
        street: formData.address.street,
        postCode: formData.address.postCode
      },
      availableTickets: availableTickets,
      ticketPrice: ticketPrice,
      adult: formData.adult
    };

    try {
      const url = editingEvent
        ? `http://localhost:8080/events/${editingEvent.id}`
        : 'http://localhost:8080/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const data = await response.json();
        return data.message || 'Failed to save event';
      }

      await fetchEvents();
      return null;
    } catch (error) {
      return 'Cannot connect to the server. Please make sure the backend is running.';
    }
  };

  const handleDelete = async (id: number): Promise<string | null> => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return null;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`http://localhost:8080/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          await fetchEvents();
          return null;
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return null;
        } else {
          const data = await response.json();
          return data.message || 'Failed to delete event';
        }
      } catch (error) {
        return 'Cannot connect to the server. Please make sure the backend is running.';
      }
    }
    return null;
  };

  return { handleSubmit, handleDelete };
} 