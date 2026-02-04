import { describe, it, expect } from 'vitest';
import { formatPrice, formatWhatsAppLink, generateSlug, generateOptimizedSlug, cn } from './utils';

describe('Utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
        });

        it('should handle conditional classes', () => {
            expect(cn('bg-red-500', false && 'text-white', 'p-4')).toBe('bg-red-500 p-4');
        });

        it('should merge tailwind classes using tailwind-merge', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8');
            expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
        });
    });

    describe('formatPrice', () => {
        it('should format price correctly in FCFA', () => {
            expect(formatPrice(1000)).toBe('1\u202F000 FCFA'); // \u202F is non-breaking space used by Intl
            expect(formatPrice(15000)).toBe('15\u202F000 FCFA');
        });

        it('should allow custom currency', () => {
            expect(formatPrice(50, 'EUR')).toBe('50 EUR');
        });
    });

    describe('formatWhatsAppLink', () => {
        it('should format simple number correctly', () => {
            const link = formatWhatsAppLink('0707070707');
            expect(link).toContain('https://wa.me/2250707070707');
        });

        it('should handle number with +225 prefix', () => {
            const link = formatWhatsAppLink('+2250707070707');
            expect(link).toContain('https://wa.me/2250707070707');
        });

        it('should clean spaces and special characters', () => {
            const link = formatWhatsAppLink('+225 07-07 07 (07) 07');
            expect(link).toContain('https://wa.me/2250707070707');
        });

        it('should include custom message', () => {
            const link = formatWhatsAppLink('0102030405', 'Hello World');
            expect(link).toContain('text=Hello%20World');
        });
    });

    describe('generateSlug', () => {
        it('should slugify text correctly', () => {
            expect(generateSlug('Hello World')).toBe('hello-world');
        });

        it('should handle accents', () => {
            expect(generateSlug('Hélène et garçons')).toBe('helene-et-garcons');
        });

        it('should remove special characters', () => {
            expect(generateSlug('Super @ Salon !')).toBe('super-salon');
        });
    });

    describe('generateOptimizedSlug', () => {
        it('should combine name and category', () => {
            expect(generateOptimizedSlug('Salon Marie', 'Coiffure')).toBe('salon-marie-coiffure');
        });
    });
});
