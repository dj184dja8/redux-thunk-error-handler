function createThunkMiddleware(extraArgument) {
  return (errorHandler) => ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      let result = null;
      try {
        result = action(dispatch, getState, extraArgument);
      } catch (err) {
        if (errorHandler) {
          dispatch(errorHandler(err));
        } else {
          throw err;
        }
      }

      if (result instanceof Promise) {
        result = result
          .then((res) => res)
          .catch((err) => {
            if (errorHandler) {
              dispatch(errorHandler(err));
            } else {
              throw err;
            }
          });
      }
      return result;
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
