const $ = id => document.getElementById(id);
function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('show'), 4200); }
function page(name) {
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('active', el.id === name));
  document.querySelectorAll('.nav').forEach(el => el.classList.toggle('active', el.dataset.page === name));
  document.querySelector('main').scrollTop = 0;
}
document.querySelectorAll('.nav').forEach(el => el.addEventListener('click', () => page(el.dataset.page)));
$('get-started').addEventListener('click', () => page('setup'));
function setBadge(id, text, good) { const el = $(id); el.textContent = text; el.classList.toggle('good', good); }
async function refresh() {
  const [info, devices, windows] = await Promise.all([window.neo.info(), window.neo.devices(), window.neo.windows()]);
  const mice = devices.filter(d => d.type === 'mouse');
  const keyboards = devices.filter(d => d.type === 'keyboard');
  setBadge('windows-status', info.platform === 'win32' ? 'Compatible OS' : 'Windows required', info.platform === 'win32');
  setBadge('minecraft-status', `${windows.length} Java window${windows.length === 1 ? '' : 's'}`, windows.length === 2);
  setBadge('engine-status', `${keyboards.length} keyboard HID · ${mice.length} mice`, keyboards.length >= 2 && mice.length >= 2);
  $('readiness').textContent = `${windows.length} Java windows detected`;
  $('windows-list').textContent = windows.length ? windows.map(w => `${w.title} (PID ${w.pid})`).join('\n') : 'No visible Java windows found.';
  $('devices-list').textContent = devices.length ? devices.map(d => `${d.type.toUpperCase()} · ${d.name}`).join('\n') : 'No input devices found.';
}
$('refresh').addEventListener('click', () => refresh().catch(e => toast(e.message)));
document.getElementById('install-runtime').addEventListener('click', async () => {
  try {
    const paths = await window.neo.installRuntime();
    if (paths.length) toast(`Installed the Minecraft 26.2 input runtime in ${paths.length} game director${paths.length === 1 ? 'y' : 'ies'}.`);
  } catch (e) { toast(e.message); }
});
document.querySelectorAll('[data-layout]').forEach(el => el.addEventListener('click', async () => {
  try { await window.neo.layout(el.dataset.layout); toast('Minecraft windows arranged. Select devices in each instance with Alt + F8.'); }
  catch (e) { toast(e.message); }
}));
refresh().catch(e => toast(e.message));
