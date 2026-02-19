const NavLinkBehavior = {
  toNewPage: 'toNewPage',
  toExternalPage: 'toExternalPage',
  scrollTo: 'scrollTo',
  hoverMenu: 'hoverMenu',
  doNothing: 'doNothing',
} as const;

export type NavLinkBehaviorValue = (typeof NavLinkBehavior)[keyof typeof NavLinkBehavior];

export default NavLinkBehavior;
