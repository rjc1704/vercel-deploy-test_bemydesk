import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import { app, dbService } from '../shared/firebase';
import { collection, addDoc } from 'firebase/firestore';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return <>Be my Desk Start</>;
}
