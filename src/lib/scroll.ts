export function getRouteScrollTarget(
  navigationType: 'POP' | 'PUSH' | 'REPLACE',
  savedPosition?: number,
) {
  return navigationType === 'POP' ? savedPosition : undefined;
}
