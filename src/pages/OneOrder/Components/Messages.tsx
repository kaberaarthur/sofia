import React from 'react';
import { useEffect, useState } from 'react';


interface InstructionsProps {
    orderId: string;
  }

const Messages: React.FC<InstructionsProps> = ({ orderId }) => (
  <div>
    <h2>Messages</h2>
    <p>Here are the messages...</p>
    {/* Add more HTML elements or components as needed */}
  </div>
);

export default Messages;
