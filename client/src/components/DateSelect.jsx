import React, { useState } from 'react';
import BlurCircle from './BlurCircle';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DateSelect = ({ dateTime, id }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const onBookHandler = () => {
        if (!selected) {
            return toast('Please select a date');
        }
        navigate(`/movies/${id}/${selected}`);
    };

    // Format date to "DD Mon" (e.g., "26 Oct")
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Fallback if invalid
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        return `${day} ${month}`;
    };

    return (
        <div id='dateSelect' className='pt-30'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10
                relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
                <BlurCircle top='-100px' left='-100px' />
                <BlurCircle top='100px' left='0px' />
                <div>
                    <p className='text-lg font-semibold'>Choose Date</p>
                    <div className='flex items-center gap-6 text-sm mt-5'>
                        <ChevronsLeftIcon width={28} />
                        <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                            {Object.keys(dateTime).map((date) => (
                                <button
                                    key={date}
                                    onClick={() => setSelected(date)}
                                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? 'bg-primary text-white' : 'border border-primary/70'}`}
                                >
                                    {formatDate(date).split(' ').map((part, index) => (
                                        <span key={index}>{part}</span>
                                    ))}
                                </button>
                            ))}
                        </span>
                        <ChevronsRightIcon width={28} />
                    </div>
                </div>
                <button onClick={onBookHandler} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default DateSelect;