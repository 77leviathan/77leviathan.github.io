
async function fetchYouTubeTitle(url) {
  const oEmbedURL = 'https://www.youtube.com/oembed?url=' + encodeURIComponent(url) + '&format=json';
  try {
    const res = await fetch(oEmbedURL);
    const data = await res.json();
    return data.title;
  } catch (e) {
    return "제목을 불러올 수 없음";
  }
}

function getThumbnail(youtubeUrl) {
  let videoId;
  try {
    if (youtubeUrl.includes("youtu.be")) {
      // 짧은 URL에서 ID 추출 (슬래시 뒤, 쿼리 앞까지)
      videoId = youtubeUrl.split('/').pop().split('?')[0];
    } else {
      // 긴 URL에서 v 파라미터 가져오기
      videoId = new URL(youtubeUrl).searchParams.get("v");
    }
  } catch {
    videoId = null;
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "default-thumbnail.jpg";
}

async function renderSongs() {
  const res = await fetch('data/songs.json');
  const songs = await res.json();
  for (const type in songs) {
    const container = document.getElementById(`${type}-songs`);
    for (const song of songs[type]) {
      const title = song.title === "auto" ? await fetchYouTubeTitle(song.youtube) : song.title;
      const artist = song.artist ? song.artist + " - " : "";
      container.innerHTML += `
        <div class="song">
          <img src="${getThumbnail(song.youtube)}" alt="${artist + title}">
          <p><a href="${song.youtube}" target="_blank">${artist}${title}</a></p>
        </div>`;
    }
  }
}

async function renderAnimeList() {
  const res = await fetch('data/anime.json');
  const animeList = await res.json();
  const container = document.getElementById("anime-list");
  container.innerHTML = "";
  animeList.forEach(anime => {
    container.innerHTML += `
      <div class="anime-card">
        <img src="${anime.image}" alt="${anime.title}">
        <h3>${anime.title} ⭐${anime.rating}</h3>
        <p>${anime.description}</p>
        <p><strong>등장인물:</strong> ${anime.characters}</p>
      </div>
    `;
  });
}

async function sortByRating() {
  const res = await fetch('data/anime.json');
  let animeList = await res.json();
  animeList.sort((a, b) => b.rating - a.rating);
  const container = document.getElementById("anime-list");
  container.innerHTML = "";
  animeList.forEach(anime => {
    container.innerHTML += `
      <div class="anime-card">
        <img src="${anime.image}" alt="${anime.title}">
        <h3>${anime.title} ⭐${anime.rating}</h3>
        <p>${anime.description}</p>
        <p><strong>등장인물:</strong> ${anime.characters}</p>
      </div>
    `;
  });
}

renderSongs();
renderAnimeList();
