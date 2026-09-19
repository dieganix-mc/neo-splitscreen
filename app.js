const $ = id => document.getElementById(id);
let settings = {};
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
  const info = await window.neo.info(); settings = info.settings;
  setBadge('windows-status', info.platform === 'win32' ? 'Compatible OS' : 'Windows required', info.platform === 'win32');
  setBadge('minecraft-status', info.minecraftDirFound ? 'Game folder found' : 'Check installation', info.minecraftDirFound);
  setBadge('engine-status', settings.nucleusPath ? 'Selected' : 'Not configured', !!settings.nucleusPath);
  $('selected-path').textContent = settings.nucleusPath || 'No executable selected';
  $('readiness').textContent = settings.nucleusPath ? 'Open Nucleus to continue' : 'Complete setup to play';
}
$('select-engine').addEventListener('click', async () => { try { if (await window.neo.pickNucleus()) { await refresh(); toast('Nucleus Co-op selected.'); } } catch (e) { toast(e.message); } });
$('launch').addEventListener('click', async () => { try { await window.neo.launchNucleus(); toast('Nucleus Co-op opened. Set up the Minecraft handler and devices there.'); } catch (e) { toast(e.message); } });
const links = { 'download-engine':'https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases', 'minecraft-guide':'https://nucleuscoop.org/games/minecraft/', 'proto-docs':'https://www.splitscreen.me/docs/proto/', 'faq':'https://www.splitscreen.me/docs/faq/' };
Object.entries(links).forEach(([id,url]) => $(id).addEventListener('click', () => window.neo.openExternal(url).catch(e => toast(e.message))));
refresh().catch(e => toast(e.message));
