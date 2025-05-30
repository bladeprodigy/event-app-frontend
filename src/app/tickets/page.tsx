'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: number;
  name: string;
  surname: string;
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
  };
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:8080/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setError('Failed to fetch tickets');
      }
    } catch (error) {
      setError('An error occurred while fetching tickets');
    }
  };

  const handleDelete = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        const response = await fetch(`http://localhost:8080/tickets/${ticketId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          fetchTickets();
        } else {
          setError('Failed to delete ticket');
        }
      } catch (error) {
        setError('An error occurred while deleting the ticket');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Browse Events
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{ticket.event.name}</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Date:</span> {new Date(ticket.event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Location:</span> {ticket.event.location}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Attendee:</span> {ticket.name} {ticket.surname}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">You haven't purchased any tickets yet.</p>
            <button
              onClick={() => router.push('/events')}
              className="mt-4 text-indigo-600 hover:text-indigo-500"
            >
              Browse available events
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 