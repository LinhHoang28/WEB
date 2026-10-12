export async function loadRepos() {
  const url = 'https://api.github.com/users/LinhHoang28/repos?sort=updated&per_page=6';

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('GitHub trả về ' + res.status);
  }

  const data = await res.json();
  return data.map((r) => ({
    name: r.name,
    url: r.html_url,
    desc: r.description ?? 'Chưa có mô tả',
    stars: r.stargazers_count,
  }));
}
const TTL = 10 * 60 * 1000;
function readCache(user) {
  const raw =
    localStorage.getItem('repos:' + user);
  if (!raw) return null;
  const { at, repos } = JSON.parse(raw);
  if (Date.now() - at > TTL) return null;
  return repos;
}

function writeCache(user, repos) {
  localStorage.setItem(
    'repos:' + user,
    JSON.stringify({ at: Date.now(), repos }),
  );
}