export const hasMenuAccess = (menuName, userRole) => {
  if (!userRole || !userRole.menus) {
    return false;
  }
  return userRole.menus.includes(menuName);
};
