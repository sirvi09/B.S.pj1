import React from "react";
import { assets } from '../assets/assets'
import { ArrowRight,Calendar, Clock } from 'lucide-react'
import { useNavigate } from "react-router-dom";

const HeroSection = ()=>{

    const navigate = useNavigate()

    return(
        <div 
        className='flex flex-col items-start justify-center gap-4
         px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")]
        bg-cover bg-center h-screen text-white text-right'
        >

       <img src={assets.marvelLogo} alt="" className="max-h-11
        lg:h-11 mt-20"/>
       <h1 className='text-5xl md:text-[70px] leading-tight 
       font-semibold max-w-[700]'>Guardians <br/> of Galaxy</h1>

       <div className='flex items-center gap-4 text-gray-300'>
        <span>Action | Adventure | Sci-Fi</span>
        <div className='flex items-center gap-1'>
        < Calendar className='w-4 h-4' />2018
        </div>
        <div className='flex items-center gap-1'>
            <Clock className='w-4 h-4' />2h 8m
          </div>
         </div>
         <p className='max-w-md text-gray-300'>IN a post-apocalyptic world where
            cities ride on wheels and consume each other to survive, two people meet in 
            London.
         </p>
         <button onClick={()=> navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary
         hover:bg primary-dull transition rounded-full font-medium cursor-pointer'>
            Explore Movies
            <ArrowRight className='w-5 h-5'/>
         </button>
       </div>
    )
}

export default HeroSection