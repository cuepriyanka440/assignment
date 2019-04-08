const INITIAL_STATE = {
  pages: null,
  page:null,
  menus:null,
  infoMessage:null
};

const applySetPages = (state, action) => ({
  ...state,
  pages: action.pages,
});
const applySetPage = (state, action) => ({
  ...state,
  page: action.page,
});

const applySetMenus = (state, action) => ({
  ...state,
  menus: action.menus,
});

const applySetInfoMessage = (state, action) => ({
  ...state,
  infoMessage: action.infoMessage,
});


function messageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'PAGES_SET': {
      return applySetPages(state, action);
    }
    case 'PAGE_SET': {
      return applySetPage(state, action);
    }
    case 'MENUS_SET': {
      return applySetMenus(state, action);
    }
    case 'INFOMESSAGE_SET': {
      return applySetInfoMessage(state, action);
    }
    default:
      return state;
  }
}

export default messageReducer;
