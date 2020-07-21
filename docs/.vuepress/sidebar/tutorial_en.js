module.exports = function() {
    return[
        {
            title: 'Novice',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/tutorial/', 'overview'],
                ['/en/tutorial/novice/install', 'install'],
                ['/en/tutorial/novice/script_ele', 'ABC of script'],
                ['/en/tutorial/novice/run', 'run a simulation'],
                ['/en/tutorial/novice/output', 'output'],
                ['/en/tutorial/novice/data_format', 'data type'],
                ['/en/tutorial/novice/dump', 'dump data'],
                ['/en/tutorial/novice/restart', 'pause & restart'],


            ]
        },

        {
            title: 'Advanced',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/tutorial/advanced/conception', 'conception'],
                ['/en/tutorial/advanced/script_adv', 'advanced script'],
                ['/en/tutorial/advanced/neighborlist', 'neighborlist'],
                ['/en/tutorial/advanced/balance', 'load balance'],
                
              
            ]
        },

        {
            title: 'DIY LAMMPS',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                
                ['/en/tutorial/customize/', 'DIY your LAMMPS funcation'],
                ['/en/tutorial/customize/DIY_fix', 'customize fix'],

                
              
            ]
        }

    ]
}