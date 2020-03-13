module.exports = function() {
    return[
        {
            title: '一般命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/command/general/', '概览'],
                ['/command/general/mass', '质量设定'],
                ['/command/general/group', '群设定'],
                ['/command/general/neighbor', '临近表设定'],
                ['/command/general/set', '属性设定'],
                ['/command/general/timestep', '步长设定'],
                ['/command/general/reset_timestep', '重置步长'],
                ['/command/general/velocity', '速度设定'],
                
            ]
        },

        {
            title: 'fix命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/command/fix/', '概览'],

            ]
        },

        {
            title: 'compute命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/command/compute/', '概览'],

            ]
        },


    ]
}