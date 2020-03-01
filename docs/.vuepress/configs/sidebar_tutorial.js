module.exports = function() {
    return[
        {
            title: '入门篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/tutorial/', '概览'],
                ['/tutorial/install', '安装'],
                ['/tutorial/script_ele', '脚本入门'],
                ['/tutorial/run', '启动计算'],
                ['/tutorial/output', '系统输出'],

                ['/tutorial/dump', '数据转存'],

                ['/tutorial/restart', '暂停与重启'],


            ]
        },

        {
            title: '进阶篇',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/tutorial/conception', '术语概念'],
                ['/tutorial/script_adv', '脚本进阶'],
              
            ]
        }


    ]
}