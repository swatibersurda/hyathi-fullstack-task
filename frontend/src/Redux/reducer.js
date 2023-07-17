import * as Types from "./actionTypes";
const intialState = {
  loading: false,
  pokemon: [],
  user: {},
  isError: false,
};
export const reducer = (state = intialState) => {
  switch (action.type) {
    case Types.POST_REGISTER_REQUEST: {
      return {
        loading: true,
      };
    }
    case Types.POST_REGISTER_SUCCESS: {
      return {
        loading: false,
      };
    }
    case Types.POST_REGISTER_FAILURE: {
        return {
          isError: true,
        };
      }

    default:
      return state;
  }
};
