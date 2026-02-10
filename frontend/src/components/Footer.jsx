
import { useEffect, useState } from 'react';
import contentService from '../services/content.service';

export default function Footer() {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        contentService.getSocialLinks().then(setSocialLinks);
    }, []);

    const getIcon = (iconCode) => {
        // Simplified icon mapping - in production, use a library like react-icons or heroicons properly
        const icons = {
            'facebook': <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />,
            'twitter': <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />,
            'instagram': <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m0 2a3.8 3.8 0 00-3.8 3.8v8.4A3.8 3.8 0 007.8 20h8.4a3.8 3.8 0 003.8-3.8V7.8A3.8 3.8 0 0016.2 4H7.8z" />,
            'linkedin': <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />,
            'github': <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
        };
        // Default icon if not found
        return icons[iconCode.toLowerCase()] || <circle cx="12" cy="12" r="10" />;
    };

    return (
        <footer className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">

                    <div className="flex space-x-6 mb-8">
                        {socialLinks.map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors">
                                <span className="sr-only">{link.platform}</span>
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    {getIcon(link.iconCode)}
                                </svg>
                            </a>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-base text-gray-500">
                            &copy; {new Date().getFullYear()} JustBookAndRelax.
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Made with ❤️ for travelers.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
