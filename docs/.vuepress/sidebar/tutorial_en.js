module.exports = function() {
    return[
        {
            title: 'Novice',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/tutorial/', 'overview'],
                ['/en/tutorial/install', 'install'],
                ['/en/tutorial/script_ele', 'ABC of script'],
                ['/en/tutorial/run', 'run a simulation'],
                ['/en/tutorial/output', 'output'],
                ['/en/tutorial/data_format', 'data type'],
                ['/en/tutorial/dump', 'dump data'],
                ['/en/tutorial/restart', 'pause & restart'],


            ]
        },

        {
            title: 'Advanced',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/tutorial/conception', 'conception'],
                ['/en/tutorial/script_adv', 'advanced script'],
                
                ['/en/tutorial/balance', 'load balance'],
                
              
            ]
        }


    ]
}