export const getCurrentUser = () => sessionStorage.getItem("chatUser") || "";
export const setCurrentUser = (user: string) =>
  sessionStorage.setItem("chatUser", user);
export const logoutCurrentUser = () => sessionStorage.removeItem("chatUser");
