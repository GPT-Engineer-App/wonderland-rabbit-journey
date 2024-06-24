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
  const [explosions, setExplosions] = useState([]);

  const [description, setDescription] = useState("Welcome to the Rabbit's Point of View. Use WASD keys to move the rabbit and collect carrots!");
  const [holePosition, setHolePosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [canDodge, setCanDodge] = useState(true);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const handleDodge = () => {
    if (canDodge) {
      setVelocity({ x: velocity.x * 2, y: velocity.y * 2 });
      setCanDodge(false);
      setTimeout(() => {
        setCanDodge(true);
      }, 5000);
    }
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'w':
        setVelocity((prevVelocity) => ({ ...prevVelocity, y: prevVelocity.y - 1 }));
        break;
      case 'a':
        setVelocity((prevVelocity) => ({ ...prevVelocity, x: prevVelocity.x - 1 }));
        break;
      case 's':
        setVelocity((prevVelocity) => ({ ...prevVelocity, y: prevVelocity.y + 1 }));
        break;
      case 'd':
        setVelocity((prevVelocity) => ({ ...prevVelocity, x: prevVelocity.x + 1 }));
        break;
      case ' ':
        handleDodge();
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

  const moveMonsters = () => {
    setMonsters((prevMonsters) =>
      prevMonsters.map((monster) => {
        const dx = position.x - monster.x;
        const dy = position.y - monster.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2; // Adjust the speed of the monsters
        return {
          ...monster,
          x: monster.x + (dx / distance) * speed,
          y: monster.y + (dy / distance) * speed,
        };
      })
    );
  };

  const moveCarrots = () => {
    setCarrots((prevCarrots) =>
      prevCarrots.map((carrot) => {
        const dx = holePosition.x - carrot.x;
        const dy = holePosition.y - carrot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 2.5; // Carrot's speed is 25% of Rabbit's speed
        return {
          ...carrot,
          x: carrot.x + (dx / distance) * speed,
          y: carrot.y + (dy / distance) * speed,
        };
      })
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
    const moveRabbit = () => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + velocity.x,
        y: prevPosition.y + velocity.y,
      }));
      setVelocity((prevVelocity) => ({
        x: prevVelocity.x * 0.9, // Apply friction to simulate momentum
        y: prevVelocity.y * 0.9,
      }));
      requestAnimationFrame(moveRabbit);
    };

    requestAnimationFrame(moveRabbit);
  }, [velocity]);

  useEffect(() => {
    carrots.forEach((carrot) => {
      if (checkCollision(position, carrot)) {
        setCarrots((prevCarrots) => prevCarrots.filter((c) => c.id !== carrot.id));
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore >= SCORE_THRESHOLD) {
            setLevel((prevLevel) => {
              const newLevel = prevLevel + 1;
              if (newLevel === 2) {
                setDescription("Congratulations! You've collected enough carrots to move to the next level!");
              } else if (newLevel === 3) {
                setDescription("Amazing! You've reached the third level. Keep going!");
              }
              return newLevel;
            });
          }
          return newScore;
        });
      }
    });

    monsters.forEach((monster) => {
      if (checkCollision(position, monster)) {
        setDescription("Game Over! You collided with a monster.");
        setExplosions((prevExplosions) => [...prevExplosions, { id: Date.now(), x: position.x, y: position.y }]);
        setScore((prevScore) => prevScore - 1); // Decrement score by 1
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

  useEffect(() => {
    const monsterMoveInterval = setInterval(moveMonsters, 100);
    return () => clearInterval(monsterMoveInterval);
  }, [position]);

  useEffect(() => {
    const carrotMoveInterval = setInterval(moveCarrots, 100);
    return () => clearInterval(carrotMoveInterval);
  }, [position]);

  const handleReposition = () => {
    setPosition({
      x: getRandomInt(0, window.innerWidth - 20),
      y: getRandomInt(0, window.innerHeight - 20),
    });
  };

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
          transition: 'left 0.05s, top 0.05s',
        }}
      >
        🐇
      </div>
      <div
        style={{
          position: 'absolute',
          left: `${holePosition.x}px`,
          top: `${holePosition.y}px`,
          width: '40px',
          height: '40px',
          backgroundColor: 'black',
          borderRadius: '50%',
        }}
      />
      
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
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          style={{
            position: 'absolute',
            left: `${explosion.x}px`,
            top: `${explosion.y}px`,
            width: '50px',
            height: '50px',
            backgroundColor: 'yellow',
            borderRadius: '50%',
            animation: 'explosion-animation 0.5s ease-out',
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
      <Button className="mt-4" onClick={handleReposition}>Reposition Rabbit</Button>
    </div>
  );
};

export default RabbitPOV;