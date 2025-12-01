import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react";

import storeReducer, { initialStore } from "../store";
import { ACTIONS } from "../store/actions.js";
import apiClient from "../services/apiClient.js";
import { favoritesService } from "../services/favoritesService.js";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    const storeRef = useRef(store);

    useEffect(() => {
        storeRef.current = store;
    }, [store]);

    const actions = useMemo(
        () => createActions(() => storeRef.current, dispatch),
        [dispatch],
    );

    useEffect(() => {
        actions.restoreSession();
    }, [actions]);

    return (
        <StoreContext.Provider value={{ store, dispatch, actions }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useGlobalReducer debe usarse dentro de StoreProvider");
    }
    return context;
}

function createActions(getState, dispatch) {
    const persistToken = (token) => {
        if (token) {
            window.localStorage.setItem("jwt", token);
        } else {
            window.localStorage.removeItem("jwt");
        }
    };

    const clearFavorites = () =>
        dispatch({ type: ACTIONS.FAVORITES_CLEAR });

    const fetchFavorites = async (token) => {
        dispatch({ type: ACTIONS.FAVORITES_START });
        try {
            const items = await favoritesService.list(token);
            dispatch({
                type: ACTIONS.FAVORITES_SUCCESS,
                payload: items,
            });
            return items;
        } catch (error) {
            dispatch({
                type: ACTIONS.FAVORITES_ERROR,
                payload: error.message,
            });
            throw error;
        }
    };

    const register = async ({ email, password, displayName }) => {
        dispatch({ type: ACTIONS.AUTH_START });
        try {
            const data = await apiClient.register({
                email,
                password,
                display_name: displayName,
            });

            persistToken(data.access_token);

            dispatch({
                type: ACTIONS.AUTH_SUCCESS,
                payload: {
                    trainer: data.trainer,
                    token: data.access_token,
                },
            });

            clearFavorites();
            return data;
        } catch (error) {
            dispatch({
                type: ACTIONS.AUTH_ERROR,
                payload: error.message,
            });
            throw error;
        }
    };

    const login = async ({ email, password }) => {
        dispatch({ type: ACTIONS.AUTH_START });
        try {
            const data = await apiClient.login({ email, password });

            persistToken(data.access_token);

            dispatch({
                type: ACTIONS.AUTH_SUCCESS,
                payload: {
                    trainer: data.trainer,
                    token: data.access_token,
                },
            });

            await fetchFavorites(data.access_token);
            return data;
        } catch (error) {
            dispatch({
                type: ACTIONS.AUTH_ERROR,
                payload: error.message,
            });
            throw error;
        }
    };

    const logout = () => {
        persistToken(null);
        clearFavorites();
        dispatch({ type: ACTIONS.LOGOUT });
    };

    const restoreSession = async () => {
        const storedToken = window.localStorage.getItem("jwt");
        if (!storedToken) {
            persistToken(null);
            clearFavorites();
            dispatch({ type: ACTIONS.LOGOUT });
            return;
        }

        dispatch({ type: ACTIONS.AUTH_START });
        try {
            const data = await apiClient.me(storedToken);

            dispatch({
                type: ACTIONS.AUTH_SUCCESS,
                payload: {
                    trainer: data.trainer,
                    token: storedToken,
                },
            });

            await fetchFavorites(storedToken);
        } catch (_error) {
            persistToken(null);
            clearFavorites();
            dispatch({ type: ACTIONS.LOGOUT });
        }
    };

    const loadFavorites = async () => {
        const token = getState().auth.token;
        if (!token) return [];
        return fetchFavorites(token);
    };

    const addFavorite = async ({ pokemonId, nickname }) => {
        const token = getState().auth.token;
        if (!token) throw new Error("Debes iniciar sesión");

        await favoritesService.add(token, {
            pokemonId,
            nickname,
        });

        return fetchFavorites(token);
    };

    const updateFavorite = async (favoriteId, payload) => {
        const token = getState().auth.token;
        if (!token) throw new Error("Debes iniciar sesión");

        await favoritesService.update(token, favoriteId, payload);
        return fetchFavorites(token);
    };

    const removeFavorite = async (favoriteId) => {
        const token = getState().auth.token;
        if (!token) throw new Error("Debes iniciar sesión");

        await favoritesService.remove(token, favoriteId);
        return fetchFavorites(token);
    };

    return {
        register,
        login,
        logout,
        restoreSession,
        loadFavorites,
        addFavorite,
        updateFavorite,
        removeFavorite,
    };
}