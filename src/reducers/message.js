const INITIAL_STATE = {
  messages: null,
  message:null,
  menus:null,
};

const applySetMessages = (state, action) => ({
  ...state,
  messages: action.messages,
});
const applySetMessage = (state, action) => ({
  ...state,
  message: action.message,
});

const applySetMenus = (state, action) => ({
  ...state,
  menus: action.menus,
});


function messageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'MESSAGES_SET': {
      return applySetMessages(state, action);
    }
    case 'MESSAGE_SET': {
      return applySetMessage(state, action);
    }
    case 'MENUS_SET': {
      console.log(action)
      return applySetMenus(state, action);
    }
    default:
      return state;
  }
}

export default messageReducer;
