import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">The Rabbit's Journey in Wonderland</h1>
      <p className="mb-4">Welcome to the Rabbit's Journey in Wonderland. Follow the rabbit through a series of adventures and challenges.</p>
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/rabbit-pov" className="text-blue-500 hover:underline">Rabbit's Point of View</Link></li>
          <li><Link to="/series-narrative" className="text-blue-500 hover:underline">Series and Narrative of Happenings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Index;