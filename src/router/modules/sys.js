import Layout from '@/views/layout/Layout'

const sysRouter = {
    path: '/sys',
    component: Layout,
    redirect: '/sys/user',
    alwaysShow: true, // will always show the root menu
    meta: {
        title: 'systemManagement', // 侧边栏显示
        icon: 'chart'
    },
    children: [
        {
            path: 'user',
            component: () => import('@/views/sys/user/User'),
            name: 'user',
            meta: {
                title: 'userManagement',
                icon: 'user',
                noCache: true
                // roles: ['admin'] // or you can only set roles in sub nav
            }
        },
        {
            path: 'role',
            component: () => import('@/views/sys/role/Role'),
            name: 'role',
            meta: {
                title: 'roleManagement',
                icon: 'user',
                noCache: true
                // roles: ['admin'] // or you can only set roles in sub nav
            }
        }
    ]
}