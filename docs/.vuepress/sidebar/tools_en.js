module.exports = function() {
    return[
        {
            title: 'moltemplate',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/', 'overview'],
                ['/zh/tools/moltemplate/moltemplate', 'basic tutorial'],
                ['/zh/tools/moltemplate/opls', 'modeling via OPLS'],
                ['/zh/tools/moltemplate/packmol', 'packing small molecules via Packmol'],
                ['/zh/tools/moltemplate/pdb-lmp', 'convert .pdb to LAMMPS input'],
                
            ]
        },
        {
            title:'miscellaneous',
            collapsable:true,
            sidebarDepth: 3,
            childran:[
                ['/zh/tools/miscellaneous/', 'overview'],
                ['/zh/tools/miscellaneous/ms2lmp', 'ms转lmp'],
            ]
        },
        {
            title: 'post process',
            collapsable: true,
            sidebarDepth: 3,
            children: [
                ['/zh/tools/postprocess/', 'overview'],
                ['/zh/tools/postprocess/use_guide', 'manual'],
                ['/zh/tools/postprocess/dev_guide', 'developer guide'],
                
            ]            
        }
    ]
}