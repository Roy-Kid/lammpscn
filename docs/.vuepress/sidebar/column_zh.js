module.exports = function() {
    return[
        {
            title: '计算机基础',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/column/', '概览'],
                ['/zh/column/basic_cs/compile', 'GCC编译基础'],
                ['/zh/column/basic_cs/compile_with_python', 'C++与Python混编'],
            ]
        },

        {
            title: '非平衡热力学',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/column/nemd/triclinic', '三斜系基础'],
                ['/zh/column/nemd/deform', '拉伸压缩与剪切'],
            ]
        },

        {
            title: '技巧与方法',
            collaspable: true,
            sidebarDepth: 3,
            children:[
                ['/zh/column/trick/constraint', '限制方法'],

            ]
        },

        {
            title: 'LAMMPS中的MC',
            collaspable: true,
            sidebarDepth: 2,
            children:[
                ['/zh/column/mc/GCMC', 'GCMC'],
                ['/zh/column/mc/DSMC', 'DSMC'],
                ['/zh/column/mc/SGCMC', 'SGCMC'],
                ['/zh/column/mc/TFMC', 'TFMC'],
                
            ]
        }

    ]
}


