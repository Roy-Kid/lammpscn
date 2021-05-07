module.exports = function() {
    return[
        {
            title: '入门篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tutorial/', '介绍'],
                ['/zh/tutorial/novice/install', '安装'],
                ['/zh/tutorial/novice/script_ele', '脚本入门'],
                ['/zh/tutorial/novice/run', '启动计算'],
                ['/zh/tutorial/novice/output', '系统输出'],
                ['/zh/tutorial/novice/data_format', '数据类型'],
                ['/zh/tutorial/novice/dump', '数据转储'],
                ['/zh/tutorial/novice/restart', '暂停与重启'],
                ['/zh/tutorial/novice/reducedunit', '约化单位']


            ]
        },

        {
            title: '进阶篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tutorial/advanced/conception', '术语概念'],
                ['/zh/tutorial/advanced/script_adv', '脚本进阶'],       
                ['/zh/tutorial/advanced/neiborlist', '临近表'],
                ['/zh/tutorial/advanced/balance', '负载均衡'],
                
              
            ]
        },

        {
            title: '客制化',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tutorial/customize/', '动手写自己的代码吧~'],
                ['/zh/tutorial/customize/DIY_fix', '客制化fix'],
                ['/zh/tutorial/customize/gdb', '使用gdb调试LAMMPS'],
                ['/zh/tutorial/customize/pairwrite', '检查修订过的势函数'],
            ]
        },

    ]
}