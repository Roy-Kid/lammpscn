module.exports = function() {
    return[
        {
            title: 'general command',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/command/general/', 'overview'],
                ['/en/command/general/mass', 'mass'],
                ['/en/command/general/group', 'group'],
                ['/en/command/general/neighbor', 'neighborlist'],
                ['/en/command/general/set', 'set'],
                ['/en/command/general/timestep', 'timestep'],
                ['/en/command/general/reset_timestep', 'reset timestep'],
                ['/en/command/general/velocity', 'velocity'],
                
            ]
        },

        {
            title: 'fix command',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/command/fix/', 'overview'],

            ]
        },

        {
            title: 'compute command',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/en/command/compute/', 'overview'],

            ]
        },


    ]
}