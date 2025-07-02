import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export const subscribeToDeliveryUpdates = (orderId: string, callback: (data: any) => void) => {
  socket.emit('join-delivery-tracking', orderId);
  socket.on('location-update', callback);

  return () => {
    socket.off('location-update', callback);
  };
};