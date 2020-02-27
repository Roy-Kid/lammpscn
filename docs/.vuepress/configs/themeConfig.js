module.exports = {
    logo:{
        text: 'LAMMPS',
        subText: '中文站',
        image: '/favicon.ico',
    },

    alert: [{
        id: '2020-3-1',
        title: '文档公告',
        content: '教程和翻译的工作仍在进行中。如果您对某一领域的模拟有所深入，恳请您向本站的<a href="https://github.com/Roy-Kid/lammpscn">repo</a>贡献翻译和教程'
    }],

    repo: 'Roy-Kid/lammpscn',

    docsDir: 'docs',

    nav: require('./navbar.js'),

    sidebar: {
        '/tutorial/': require('./sidebar_tutorial.js')(),
        '/command/': require('./sidebar_command.js')(),
        '/moduling/': require('./sidebar_moduling.js')(),
    },

    editLinks: true,
    editLinkText: '在GitHub上编辑此页',
    lastUpdated: '上次更新',

    
} 