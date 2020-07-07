module.exports = [
    ['link', { rel: 'icon', href: '/icons/favicon.ico'}],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel:'apple-touch-icon', href:'/icons/apple-touch-icon.png'}],

    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],  
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['meta', {name:'keywords', content:'lammps中文,lammps,lammps教程,lammps官网'}],
    ['meta', {name:'description', content:'lammps的非官方中文文档，lammps教程'}],

    ['script', {type: 'text/javascript', scr:'./push.js'}],

        
]