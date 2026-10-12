export async function loadRepos(user) {
  const url =
    `https://api.github.com/users/${user}` +
    '/repos?sort=updated&per_page=6';

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