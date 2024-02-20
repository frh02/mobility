import images from './images';

const Menu = [
    {
        text: 'Home',
        link: '/home',
    },
    {
        text: 'Services',
        link: '#services',
    },
    {
        text: 'Range of Motion',
        link: '/rom',
    },
    {
        text: 'Sit to Stand',
        link: '/sts',
    },
    {
        text: 'Timed up and Go',
        link: '/tug',
    },
    {
        text: 'About us',
        link: '/team',
    },
];
const ServicesData = [
    {
        titleone: 'Range of Motion',
        titletwo: 'Test',
        link: '/rom',
        itemclass: 'blight',
        imgURL: images.services01,
    },
    {
        titleone: 'Sit to Stand',
        titletwo: 'Test',
        link: '/sts',
        itemclass: 'bgreen',
        imgURL: images.services02,
    },
    {
        titleone: 'Timed up and go',
        titletwo: 'Test',
        link: '/tug',
        itemclass: 'bdark',
        imgURL: images.services03,
    },
]
export default { Menu, ServicesData };