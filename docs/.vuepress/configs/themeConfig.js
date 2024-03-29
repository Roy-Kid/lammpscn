module.exports = ({
    subSidebar: 'auto',
    author: 'Roy Kid',
    repo: 'Roy-Kid/lammpscn',
    nav: [
        {
            text: '入门',
            link: '/zh/hello/'
        },
        
        {
            text: '工具',
            link: '/zh/tools/'
        },
    
        {
            text: '扩展',
            link: '/zh/extending/'
        },

    
        {
            text: '专栏',
            link: '/zh/column/'
        },
    
        {
            text: '我们',
            link: '/zh/contact/'
        },

    ],
    sidebar: {
        '/zh/hello/': require('../sidebar/hello_zh')(),
        '/zh/tools/': require('../sidebar/tools_zh')(),
        '/zh/extending/': require('../sidebar/extending_zh')(),
        '/zh/column/': require('../sidebar/column_zh')(),        
    }
})