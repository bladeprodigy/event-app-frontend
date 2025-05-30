'use client';

import { Event } from './types';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

export default function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Location:</span> {event.address.name}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Address:</span> {event.address.street}, {event.address.city}, {event.address.postCode}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Ticket Price:</span> ${event.ticketPrice}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Available Tickets:</span> {event.availableTickets}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Adult Event:</span> {event.adult ? 'Yes' : 'No'}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onEdit(event)}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={() => router.push(`/tickets/${event.id}`)}
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
        >
          Buy Ticket
        </button>
      </div>
    </div>
  );
} 