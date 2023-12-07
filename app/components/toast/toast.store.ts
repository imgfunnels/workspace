import { v4 } from "uuid";

const initialState = {
  top: [],
  "top-left": [],
  "top-right": [],
  "bottom-left": [],
  bottom: [],
  "bottom-right": []
};

export const toastStore = createStore(initialState);

function createStore(initialState: any) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const setState = (setStateFn: (values: any) => any) => {
    state = setStateFn(state);
    listeners.forEach((l) => l());
  };

  return {
    getState: () => state,
    subscribe: (listener: any) => {
      listeners.add(listener);
      return () => {
        // Delete all toasts on unmount
        setState(() => initialState);
        listeners.delete(listener);
      };
    },
    notify: (message: any) => {
      setState((prevToasts) => {
        return {
          ...prevToasts,
          bottom: [...prevToasts["bottom"], { id: v4(), message }]
        };
      });
    },
    removeToast: (id?: any, position?: any) => {
      setState((prevState) => ({
        ...prevState,
        // id may be string or number
        // eslint-disable-next-line eqeqeq
        bottom: prevState["bottom"].slice(1)
        // [position]: prevState[position].filter((toast) => toast.id != id)
      }));
    }
  };
}
