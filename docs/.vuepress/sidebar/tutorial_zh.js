module.exports = function() {
    return[
        {
            title: '入门篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [

                ['/zh/tutorial/novice/', '概览'],
                ['/zh/tutorial/novice/install/', '安装'],
                ['/zh/tutorial/script_ele', '脚本入门'],
                ['/zh/tutorial/run', '启动计算'],
                ['/zh/tutorial/output', '系统输出'],
                ['/zh/tutorial/data_format', '数据类型'],
                ['/zh/tutorial/dump', '数据转储'],
                ['/zh/tutorial/restart', '暂停与重启'],


            ]
        },

        {
            title: '进阶篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tutorial/conception', '术语概念'],
                ['/zh/tutorial/script_adv', '脚本进阶'],
                
                ['/zh/tutorial/balance', '负载均衡'],
                
              
            ]
        },

        {
            title: 'DIY LAMMPS',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tutorial/', '术语概念'],

                
              
            ]
        }


    ]
}