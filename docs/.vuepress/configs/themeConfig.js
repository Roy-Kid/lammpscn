module.exports = ({
    subSidebar: 'auto',
    author: 'Roy Kid',
    repo: 'Roy-Kid/lammpscnv2',
    nav: [
        {
            text: '初识',
            link: '/zh/hello/'
        },
    
        {
            text: '入门',
            link: '/zh/tutorial/'
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
        '/zh/tutorial/': require('../sidebar/tutorial_zh')(),
        '/zh/tools/': require('../sidebar/tools_zh')(),
        '/zh/column/': require('../sidebar/column_zh')(),        
    }
})