import { ACTIONS } from "./actions.js";

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
        throw new Error(`Unknown action type: ${action.type}`);
    }
}
