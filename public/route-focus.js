if (document.referrer.startsWith(window.location.origin)) {
  const heading = document.querySelector('main h1');
  const announcement = document.querySelector('.route-announcement');
  if (heading instanceof HTMLElement) heading.focus({ preventScroll: true });
  if (announcement) announcement.textContent = document.title;
}
