// src/front/store.js
export const ACTIONS = {
    AUTH_START: "auth_start",
    AUTH_SUCCESS: "auth_success",
    AUTH_ERROR: "auth_error",
    LOGOUT: "auth_logout",

    FAVORITES_START: "favorites_start",
    FAVORITES_SUCCESS: "favorites_success",
    FAVORITES_ERROR: "favorites_error",
    FAVORITES_CLEAR: "favorites_clear",

    SET_HELLO: "set_hello",
};

export const initialStore = () => ({
    auth: {
        token: null,
        trainer: null,
        loading: false,
        error: null,
    },
    favorites: {
        items: [],
        loading: false,
        error: null,
    },
    hello: null,
});

export default function storeReducer(store, action = {}) {
    switch (action.type) {
        case ACTIONS.AUTH_START:
            return {
                ...store,
                auth: { ...store.auth, loading: true, error: null },
            };

        case ACTIONS.AUTH_SUCCESS:
            return {
                ...store,
                auth: {
                    token: action.payload.token,
                    trainer: action.payload.trainer,
                    loading: false,
                    error: null,
                },
            };

        case ACTIONS.AUTH_ERROR:
            return {
                ...store,
                auth: {
                    ...store.auth,
                    loading: false,
                    error: action.payload,
                },
            };

        case ACTIONS.LOGOUT:
            return {
                ...store,
                auth: {
                    token: null,
                    trainer: null,
                    loading: false,
                    error: null,
                },
            };

        case ACTIONS.FAVORITES_START:
            return {
                ...store,
                favorites: {
                    ...store.favorites,
                    loading: true,
                    error: null,
                },
            };

        case ACTIONS.FAVORITES_SUCCESS:
            return {
                ...store,
                favorites: {
                    items: action.payload,
                    loading: false,
                    error: null,
                },
            };

        case ACTIONS.FAVORITES_ERROR:
            return {
                ...store,
                favorites: {
                    ...store.favorites,
                    loading: false,
                    error: action.payload,
                },
            };

        case ACTIONS.FAVORITES_CLEAR:
            return {
                ...store,
                favorites: {
                    items: [],
                    loading: false,
                    error: null,
                },
            };

        case ACTIONS.SET_HELLO:
            return {
                ...store,
                hello: action.payload,
            };

        default:
            return store;
    }
}