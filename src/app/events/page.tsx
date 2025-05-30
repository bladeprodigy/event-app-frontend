'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import { Event, EventFormData } from '../components/events/types';
import { useEventHandlers } from '../hooks/useEventHandlers';
import { useEventData } from '../hooks/useEventData';

export default function EventsPage() {
  const router = useRouter();
  const { events, isLoading, error: fetchError, fetchEvents } = useEventData();
  const { handleSubmit, handleDelete } = useEventHandlers(fetchEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    address: {
      name: '',
      city: '',
      street: '',
      postCode: '',
    },
    availableTickets: '',
    ticketPrice: '',
    adult: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchEvents();
  }, [router]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    const error = await handleSubmit(e, formData, editingEvent);
    if (error) {
      setFormError(error);
    } else {
      setIsModalOpen(false);
      setEditingEvent(null);
      setFormData({
        name: '',
        description: '',
        date: '',
        address: {
          name: '',
          city: '',
          street: '',
          postCode: '',
        },
        availableTickets: '',
        ticketPrice: '',
        adult: false,
      });
    }
  };

  const handleEventDelete = async (id: number) => {
    const error = await handleDelete(id);
    if (error) {
      setFormError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Events</h1>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              name: '',
              description: '',
              date: '',
              address: {
                name: '',
                city: '',
                street: '',
                postCode: '',
              },
              availableTickets: '',
              ticketPrice: '',
              adult: false,
            });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Event
        </button>
      </div>

      {(fetchError || formError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {fetchError || formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={() => {
              const eventDate = new Date(event.date);
              const formattedDate = eventDate.toISOString().slice(0, 16);
              setEditingEvent(event);
              setFormData({
                name: event.name,
                description: event.description,
                date: formattedDate,
                address: {
                  name: event.address.name || '',
                  city: event.address.city || '',
                  street: event.address.street || '',
                  postCode: event.address.postCode || '',
                },
                availableTickets: event.availableTickets?.toString() || '',
                ticketPrice: event.ticketPrice?.toString() || '',
                adult: event.adult || false,
              });
              setIsModalOpen(true);
            }}
            onDelete={() => handleEventDelete(event.id)}
          />
        ))}
      </div>

      {isModalOpen && (
        <EventForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
            setFormError('');
          }}
          isEditing={!!editingEvent}
        />
      )}
    </div>
  );
} 