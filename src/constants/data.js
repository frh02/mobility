import images from './images';
import { Rom } from '../components';

const Menu = [
    {
        text: 'About us',
        link: '#team',
    },
    {
        text: 'Services',
        link: '#services',
    },
    
];
const ServicesData = [
    {
        titleone: 'Range of Motion',
        titletwo: 'Test',
        link: Rom,
        itemclass: 'blight',
        imgURL: images.services01,
    },
    {
        titleone: 'Sit to Stand',
        titletwo: 'Test',
        link: '#',
        itemclass: 'bgreen',
        imgURL: images.services02,
    },
    {
        titleone: 'Timed up and go',
        titletwo: 'Test',
        link: '#',
        itemclass: 'bdark',
        imgURL: images.services03,
    },
]
export default { Menu, ServicesData };