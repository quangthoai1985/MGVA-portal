import React from 'react';
import { NewsHero } from './NewsHero';
import { Announcements } from './Announcements';
import { ParentsCorner } from './ParentsCorner';
import { Gallery } from './Gallery';
import { CoreValues } from './CoreValues';
import { Contact } from './Contact';

interface HomePageProps {
    onNavigate: (path: string, hash?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <>
            <NewsHero />
            <Announcements onNavigate={(path) => onNavigate(path)} />
            <ParentsCorner />
            <Gallery />
            <CoreValues />
            <Contact />
        </>
    );
};
