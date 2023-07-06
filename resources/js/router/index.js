import { createRouter, createWebHistory } from 'vue-router';
import { createApp } from 'vue';
import store from '../store';
// import { createRouterSync } from 'vuex-router-sync';
import Meta from 'vue-meta';
import routes from './routes';
import { nextTick } from 'vue';
import NProgress from "nprogress";
const globalMiddleware = ['locale', 'check-auth'];

// const app = createApp();
// app.use(Meta);

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Middleware for every page of the application.
router.beforeEach(async (to, from, next) => {
    let components = [];

    try {
        // Get the matched components and resolve them.
        components = await Promise.allSettled(
            router.getRoutes().flatMap((route) => route.getComponents())
        );
        components = components.map((component) => component.value);
    } catch (error) {
        if (/^Loading( CSS)? chunk (\d)+ failed\./.test(error.message)) {
            window.location.reload(true);
            return;
        }
    }

    if (components.length === 0) {
        return next();
    }

    if (components[components.length - 1].loading !== false) {
        app.$nextTick(() => app.$loading.start());
    }

    const middleware = getMiddleware(components);

    callMiddleware(middleware, to, from, (...args) => {
        if (args.length === 0) {
            app.setLayout(components[0].layout || '');
        }

        next(...args);
    });
});

router.afterEach(async (to, from) => {
    // await app.$nextTick();
    // app.$loading.finish();
    await nextTick();
    // NProgress.done();
    // app.$loading.finish();

    // Call next() to proceed to the next route
    // next();
});

// async function afterEach(to, from, next) {
//     await nextTick();
//
//     app.$loading.finish();
//
//     // Call next() to proceed to the next route
//     next();
//   }

function callMiddleware(middleware, to, from, next) {
    const stack = middleware.reverse();

    const _next = (...args) => {
        if (args.length > 0 || stack.length === 0) {
            if (args.length > 0) {
                app.$loading.finish();
            }

            return next(...args);
        }

        const { middleware, params } = parseMiddleware(stack.pop());

        if (typeof middleware === 'function') {
            middleware(to, from, _next, params);
        } else {
            throw new Error(`Undefined middleware [${middleware}]`);
        }
    };

    _next();
}

function parseMiddleware(middleware) {
    if (typeof middleware === 'function') {
        return { middleware };
    }

    const [name, params] = middleware.split(':');

    return { middleware: name, params };
}

function getMiddleware(components) {
    const middleware = [...globalMiddleware];

    components
        .filter((c) => c.middleware)
        .forEach((component) => {
            if (Array.isArray(component.middleware)) {
                middleware.push(...component.middleware);
            } else {
                middleware.push(component.middleware);
            }
        });

    return middleware;
}

function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition;
    }

    if (to.hash) {
        return { el: to.hash, behavior: 'smooth' };
    }

    const [component] = router
        .getRoutes()
        .flatMap((route) => route.getComponents())
        .slice(-1);

    if (component && component.scrollToTop === false) {
        return {};
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ top: 0, left: 0, behavior: 'smooth' });
        }, 190);
    });
}

// createRouterSync(store, router);

// app.use(router);
// app.use(store);
// app.mount('#app');

export default router;
