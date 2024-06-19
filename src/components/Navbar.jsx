import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">Wonderland</Link>
        <ul className="flex space-x-4">
          <li><Link to="/rabbit-pov" className="text-white hover:underline">Rabbit's Point of View</Link></li>
          <li><Link to="/series-narrative" className="text-white hover:underline">Series and Narrative of Happenings</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;