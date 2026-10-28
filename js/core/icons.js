/* =====================================================================
   ICONS — kumpulan ikon SVG bersama (WhatsApp, Instagram, X, dll.)
   ===================================================================== */
const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  camera:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4l-1.5 2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-3.5L15 4H9zm3 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
  video:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7.5A2.5 2.5 0 015.5 5h8A2.5 2.5 0 0116 7.5v2.2l4.2-2.7a.8.8 0 011.3.7v9.6a.8.8 0 01-1.3.7L16 14.3v2.2a2.5 2.5 0 01-2.5 2.5h-8A2.5 2.5 0 013 16.5v-9z"/></svg>',
  phone:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.56 3.5a1 1 0 01-.25 1z"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3.5 3.5 0 003.5-3.5v-6a3.5 3.5 0 00-7 0v6A3.5 3.5 0 0012 15zm6-3.5a6 6 0 01-5 5.9V20h-2v-2.6a6 6 0 01-5-5.9h2a4 4 0 008 0h2z"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.4-7.5a1 1 0 000-1.8L3.4 3.6a1 1 0 00-1.4 1.1L3.5 10l9 2-9 2-1.5 5.3a1 1 0 001.4 1.1z"/></svg>',
  sticker:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M20 12a8 8 0 10-8 8c4.4 0 8-3.6 8-8zm0 0c-4 0-8 0-8 8"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="10" r="1" fill="currentColor" stroke="none"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.9l12-7.5a1 1 0 000-1.8l-12-7.5A1 1 0 007 4.5z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 3l7 7-2 1-3.5 3.5.5 4-1.5 1.5L9.5 15 4 20.5 3.5 20 9 14.5 5 10.5l1.5-1.5 4 .5L14 6z"/></svg>',
  mute: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22zm7-5v-5a7 7 0 00-5-6.7V4a2 2 0 10-4 0v.3A7 7 0 005 11v6l-2 2v1h18v-1l-2-2z"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" fill="none"/></svg>',
  image:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm3.5 3.2a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM5 17h14l-4.5-6-3.5 4.5-2-2.5L5 17z"/></svg>',
  updates:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3.2 2.6"/><circle cx="12" cy="12" r="4.2" fill="currentColor"/></svg>',
  comm: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11a3 3 0 100-6 3 3 0 000 6zm-8 0a3 3 0 100-6 3 3 0 000 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.8 2 1.9 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/></svg>',
  chats:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 000-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 00-1.7-1L15 3.5h-4l-.4 2.5a7.6 7.6 0 00-1.7 1l-2.4-1-2 3.4L6.6 11a7.5 7.5 0 000 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 001.7 1l.4 2.5h4l.4-2.5a7.6 7.6 0 001.7-1l2.4 1 2-3.4-2.2-1.6zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>',
};
const TICK_ONE =
  '<svg viewBox="0 0 16 11" fill="currentColor"><path d="M11.1.6L5.5 6.9 3.2 4.6l-1 1L5.5 9l6.6-7.4z"/></svg>';
const TICK_TWO =
  '<svg viewBox="0 0 16 11" fill="currentColor"><path d="M11.1.6L5.5 6.9 3.2 4.6l-1 1L5.5 9l6.6-7.4zM15 .6L8.9 7.6l.9.9L16 1.6z"/></svg>';
const tick = (st) =>
  '<span class="tk ' + (st === "read" ? "read" : "") + '">' + (st === "sent" ? TICK_ONE : TICK_TWO) + "</span>";
