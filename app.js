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