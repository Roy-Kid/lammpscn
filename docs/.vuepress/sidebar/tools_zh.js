module.exports = function() {
    return[
        {
            title: '建模',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/', '概览'],
                ['/zh/tools/moduling/moltemplate', 'moltemplate'],
                
            ]
        },

        {
            title: '后处理',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/postprocess/', '概览'],
                ['/zh/tools/postprocess/use_guide', '使用手册'],
                ['/zh/tools/postprocess/dev_guide', '开发者手册'],
                
            ]            
        }
    ]
}