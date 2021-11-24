module.exports = function () {
    return [
        {
            title: 'molpy',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/molpy/', '概览'],
                ['/zh/tools/molpy/quickstart', '快速入门'],

            ]

        },
        {
            title: '建模: moltemplate',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/moltemplate/', '概览'],
                ['/zh/tools/moltemplate/moltemplate', '基础操作'],
                ['/zh/tools/moltemplate/opls', '使用OPLS构建模型'],
                ['/zh/tools/moltemplate/packmol', '使用Packmol填充小分子'],
                ['/zh/tools/moltemplate/pdb-lmp', '.pdb转化为LAMMPS输入'],

            ]
        },

        {
            title: 'miscellaneous',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/miscellaneous/', 'overview'],
                ['/zh/tools/miscellaneous/ms2lmp', 'ms转lmp'],
            ]
        },

        {
            title: 'VMD',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/vmd/', '概览'],
                ['/zh/tools/vmd/vmd', 'VMD']

            ]
        }
    ]
}
