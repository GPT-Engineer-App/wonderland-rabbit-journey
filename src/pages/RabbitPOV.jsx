import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getRandomInt } from '../utils';

const SCORE_THRESHOLD = 15;
const MONSTER_SPAWN_THRESHOLD = 5;

const RabbitPOV = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [carrots, setCarrots] = useState([]);
  const [monsters, setMonsters] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [theme, setTheme] = useState('normal');

  const [description, setDescription] = useState("Welcome to the Rabbit's Point of View. Use WASD keys to move the rabbit and collect carrots!");

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

  const spawnCarrot = () => {
    const newCarrot = {
      id: Date.now(),
      x: getRandomInt(0, window.innerWidth - 20),
      y: getRandomInt(0, window.innerHeight - 20),
    };
    setCarrots((prevCarrots) => [...prevCarrots, newCarrot]);
  };

  const spawnMonster = () => {
    const newMonster = {
      id: Date.now(),
      x: getRandomInt(0, window.innerWidth - 20),
      y: getRandomInt(0, window.innerHeight - 20),
      type: getRandomInt(1, 3), // Different types of monsters
    };
    setMonsters((prevMonsters) => [...prevMonsters, newMonster]);
    const audio = new Audio('/sounds/monster_spawn.mp3');
    audio.play();
  };

  const checkCollision = (rabbit, entity) => {
    return (
      rabbit.x < entity.x + 20 &&
      rabbit.x + 20 > entity.x &&
      rabbit.y < entity.y + 20 &&
      rabbit.y + 20 > entity.y
    );
  };

  useEffect(() => {
    const carrotInterval = setInterval(spawnCarrot, 2000);
    return () => clearInterval(carrotInterval);
  }, []);

  useEffect(() => {
    if (level > MONSTER_SPAWN_THRESHOLD) {
      const monsterInterval = setInterval(spawnMonster, 5000);
      return () => clearInterval(monsterInterval);
    }
  }, [level]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    carrots.forEach((carrot) => {
      if (checkCollision(position, carrot)) {
        setCarrots((prevCarrots) => prevCarrots.filter((c) => c.id !== carrot.id));
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore >= SCORE_THRESHOLD) {
            setLevel((prevLevel) => prevLevel + 1);
            setDescription("Congratulations! You've collected enough carrots to move to the next level!");
          }
          return newScore;
        });
      }
    });

    monsters.forEach((monster) => {
      if (checkCollision(position, monster)) {
        setDescription("Game Over! You collided with a monster.");
        // Implement game over logic
      }
    });
  }, [position, carrots, monsters]);

  useEffect(() => {
    if (score >= SCORE_THRESHOLD) {
      setTheme('scary');
      const audio = new Audio('/sounds/scary_background.mp3');
      audio.loop = true;
      audio.play();
    }
  }, [score]);

  return (
    <div className={`container mx-auto p-4 ${theme === 'scary' ? 'bg-black text-red-500' : ''}`}>
      <h1 className="text-4xl font-bold mb-4">Rabbit's Point of View</h1>
      <p className="mb-4">{description}</p>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Use the WASD keys to move the rabbit and collect carrots. Each carrot collected increases your score.</p>
        </CardContent>
      </Card>
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
      {carrots.map((carrot) => (
        <div
          key={carrot.id}
          style={{
            position: 'absolute',
            left: `${carrot.x}px`,
            top: `${carrot.y}px`,
            width: '20px',
            height: '20px',
            backgroundColor: 'orange',
          }}
        />
      ))}
      {monsters.map((monster) => (
        <div
          key={monster.id}
          style={{
            position: 'absolute',
            left: `${monster.x}px`,
            top: `${monster.y}px`,
            width: '20px',
            height: '20px',
            backgroundColor: monster.type === 1 ? 'red' : monster.type === 2 ? 'green' : 'blue',
          }}
        />
      ))}
      <div className="score mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{score}</p>
          </CardContent>
        </Card>
      </div>
      <Button className="mt-4" onClick={() => setDescription("Keep going! Collect more carrots!")}>Update Description</Button>
      <Button className="mt-4" onClick={() => setDescription("Congratulations! You've collected enough carrots to move to the next adventure!")}>Next Adventure</Button>
    </div>
  );
};

export default RabbitPOV;