module.exports = function() {
    return[
        {
            title: '一般命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/command/general/', '概览'],
                ['/zh/command/general/mass', '质量设定'],
                ['/zh/command/general/group', '群设定'],
                ['/zh/command/general/neighbor', '临近表设定'],
                ['/zh/command/general/set', '属性设定'],
                ['/zh/command/general/timestep', '步长设定'],
                ['/zh/command/general/reset_timestep', '重置步长'],
                ['/zh/command/general/velocity', '速度设定'],
                
            ]
        },

        {
            title: 'fix命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/command/fix/', '概览'],

            ]
        },

        {
            title: 'compute命令',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/command/compute/', '概览'],

            ]
        },


    ]
}