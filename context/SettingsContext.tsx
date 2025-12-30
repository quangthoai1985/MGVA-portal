import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GeneralSettings } from '../types';

interface SettingsContextType {
    settings: GeneralSettings | null;
    loading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'settings', 'general'));
            if (docSnap.exists()) {
                setSettings(docSnap.data() as GeneralSettings);
            }
        } catch (error) {
            console.error("Error fetching general settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Set up real-time listener for settings
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                const data = doc.data() as GeneralSettings;
                setSettings(data);
                // Update document title dynamically
                if (data.pageTitle) {
                    document.title = data.pageTitle;
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
