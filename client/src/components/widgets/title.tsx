import { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setDate(new Date().toLocaleDateString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <div className="text-lg font-mono">{time} {date.split("/20")[0]}</div>;
}

const Title = () => {
  return (
    <div className='flex gap-4 border-b pb-2 h-[80px]'>
      <img src="https://i.pinimg.com/736x/47/da/23/47da23fe81246779fde9a7c8cbb09d11.jpg" className='object-cover w-16 h-16 rounded-full' alt="Title" />
      <div>
        <h1 className="text-2xl font-bold">Matta</h1>
        <Clock />
      </div>
    </div>
  );
}

export default Title
