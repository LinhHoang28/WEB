import { projects } from './data.js';
import { loadRepos } from './repos.js';
const ul = document.querySelector('#project-list');
const tpl = document.querySelector('#project-card');
const bar = document.querySelector('#filters');
const toggle = document.querySelector('#theme-toggle');
const root = document.documentElement;
const tags = [...new Set(
  projects.flatMap((p) => p.tags)
)];
for (const tag of ['all', ...tags]) {
  const b = document.createElement('button');
  b.textContent = tag;
  b.dataset.tag = tag;
  bar.append(b);
}

function setActive(tag) {
  for (const b of bar.children) {
    b.classList.toggle('active', b.dataset.tag === tag);
  }
}

function render(list) {
  ul.textContent = '';
  for (const p of list) {
    const li = tpl.content.cloneNode(true);
    li.querySelector('h3').textContent = p.title;
    li.querySelector('.tags').textContent = p.tags.join(', ');
    ul.append(li);
  }
}
render(projects);
setActive('all');

bar.addEventListener('click', (e) => {
  const tag = e.target.dataset.tag;
  if (!tag) return;

  const filtered = tag === 'all'
    ? projects
    : projects.filter((p) => p.tags.includes(tag));

  render(filtered);
  setActive(tag);
});
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function applyTheme(theme) {
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

let current = localStorage.getItem('theme')
  ?? (prefersDark.matches ? 'dark' : 'light');
applyTheme(current);

toggle.addEventListener('click', () => {
  current = current === 'dark' ? 'light' : 'dark';
  applyTheme(current);
  localStorage.setItem('theme', current);
});
const state = document.querySelector('#repos-state');
const list = document.querySelector('#repo-list');

function repoCard(r) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = r.url;
  a.textContent = r.name;
  const p = document.createElement('p');
  p.textContent = `★ ${r.stars} · ${r.desc}`;
  li.append(a, p);
  return li;
}
async function showRepos(user) {
  state.textContent = 'Đang tải…';
  list.textContent = '';
  try {
    const repos = await loadRepos(user);
    state.textContent = repos.length ? ''
      : 'Chưa có repo công khai.';
    repos.forEach((r) => list.append(repoCard(r)));
  } catch (err) {
    state.textContent = 'Không tải được: ' + err.message;
    const again = document.createElement('button');
    again.textContent = 'Thử lại';
    again.onclick = () => showRepos(user);
    state.append(again);
  }
}
showRepos('LinhHoang28');