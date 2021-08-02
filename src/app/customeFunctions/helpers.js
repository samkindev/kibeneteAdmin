import { useEffect, useState } from 'react';
/**
 * Divide the data array into groups
 * @param {array} data Array of structured data [...{...keys, name}]
 * @returns 
 */
export const useCreateGroupsFromData = (data) => {
    const [grps, setGrps] = useState([]);

    useEffect(() => {
        if (!(data instanceof Array)) {
            throw new Error("Data must be an array.");
        }

        if (data.length === 0) {
            return [];
        }

        if (data.some(d => !d.name)) {
            throw new Error("Bad data structure");
        }

        let groups = [{ name: data[0].name[0], elements: [] }];

        data.forEach(d => {
            if (!groups.some(g => g.name === d.name[0])) {
                groups.push({ name: d.name[0], elements: [] });
            }
        });

        groups.forEach(g => {
            g.elements.push(...data.filter(d => d.name[0] === g.name));
        });

        setGrps(groups);
    }, [data]);

    return grps;
};

/**
 * Compares two dates.
 * @param {date} d1 first date to compare
 * @param {date} d2 second date to compare
 * @returns 1 if d1 <= d2, 0 otherwise
 */
export const compareDates = (d1, d2) => {
    if (d1 <= d2) return 1;
    else return 1;
};


/**
 * Shaffles the array elements
 * @param {array} tab Array of any type containing elements  you want to shaffle
 * @returns shaffled array
 */
export const shaffleArray = (tab) => {
    if (!(tab instanceof Array)) {
        throw new Error('Tab is not an array');
    }
    const tabLen = tab.length;
    const shaffledTab = Array(tabLen).fill(null);

    tab.forEach(element => {
        let indice;

        while (shaffledTab[indice] !== null) {
            indice = Math.floor(Math.random() * tabLen);
        }

        shaffledTab[indice] = element;
    });

    return shaffledTab;
};