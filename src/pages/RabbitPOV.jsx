import React, { useState, useEffect } from 'react';

const RabbitPOV = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'w':
        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y - 10 }));
        break;
      case 'a':
        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x - 10 }));
        break;
      case 's':
        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y + 10 }));
        break;
      case 'd':
        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x + 10 }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Rabbit's Point of View</h1>
      <p className="mb-4">Experience Wonderland through the eyes of the rabbit. Customize its appearance, follow its objectives, and interact with other characters.</p>
      <div className="placeholder-content">
        <p>Placeholder for visual representation, descriptive text, and interactive elements.</p>
      </div>
      <div
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: 'left 0.1s, top 0.1s',
        }}
      >
        🐇
      </div>
    </div>
  );
};

export default RabbitPOV;